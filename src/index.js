require('dotenv').config();
const ChopTools = require('chop-tools');
const { DiscordAPIError } = require('discord.js');

const database = require('./services/database');
const terminate = require('./services/terminate');
const Alert = require('./services/alert');
const Metrics = require('./services/metrics');
const sentiment = require('./services/sentiment');

const GuildSettings = require('./models/guildSettings');
const Bloo = require('./models/bloo');

const web = require('./web');

const guildCreate = require('./events/guildCreate');
const vote = require('./events/vote');
const mention = require('./events/mention');

const logger = require('./services/logger');
const logCommands = require('./middleware/logCommands');
const attachProfile = require('./middleware/attachProfile');
const attachSettings = require('./middleware/attachSettings');

database(() => {
  const client = new ChopTools.Client();

  Reflect.defineProperty(client, 'ignoredChannels', {
    value: new Set(),
    writable: false,
  });

  Reflect.defineProperty(client, 'logger', {
    value: logger,
    writable: false,
  });

  Reflect.defineProperty(client, 'metrics', {
    value: new Metrics(),
    writable: false,
  });

  client.logger.info('[Database] MongoDB Connected.');

  if (process.env.NODE_ENV === 'production') {
    try {
      const DBL = module.require('dblapi.js');
      const dbl = new DBL(process.env.TOPGG_TOKEN, client);
      dbl.on('error', err => {
        client.emit('error', err);
      });
    } catch(err) {
      logger.error('Could not dbl instance.');
      logger.error(err);
    }
  }

  // add ignored channels saved in db to the ignore list
  GuildSettings.find({})
    .exec()
    .then(documents => {
      let channelCount = 0;
      let guildCount = 0;
      documents.forEach(document => {
        document.listenerSettings.ignored.forEach(c => {
          channelCount += 1;
          client.listeners.ignored.ignoreChannel(c, 0);
        });
        if (!document.listenerSettings.allow) {
          guildCount += 1;
          client.listeners.ignored.ignoreGuild(document.guildId);
        }
      });
      client.logger.info(
        `[Bloo] Adding ${channelCount} channels and ${guildCount} guilds to the listener ignore list from the database.`,
      );
    })
    .catch(client.logger.error);

  // ignored guilds
  client.listeners.ignored.ignoreGuild('264445053596991498', 0);

  // set log level from db
  Bloo.findOne({})
    .exec()
    .then(config => {
      if (!config) return;
      client.logger.setLevel(config.loglevel);
      client.logger.info(
        '[Log] Logging level set to',
        `${['Trace', 'Debug', 'Info', 'Warn', 'Error', 'Silent'][client.logger.getLevel()]}.`,
      );
    })
    .catch(client.logger.error);

  client.on('ready', () => {
    client.logger.info(`[Bloo] It's discord time! [${client.user.tag}]`);
    client.user.setActivity('in a field of flowers', { type: 'PLAYING' });
  });

  client.on('error', err => {
    client.logger.error('[Bloo] An error occurred.\n', err);
    if (err instanceof DiscordAPIError) {
      return;
    }
    Alert.log(
      Alert.types.error,
      client,
      `Omg <@517599684961894400> is going to be so mad :cold_sweat:
    \`\`\`${err.message}\n\n${err.stack}\`\`\``,
    ).catch(console.error); // console.error instead of emit('error') or we could end up in a loop
  });

  client.on('warn', err => {
    client.logger.warn('[Bloo] WARNING:', err);
  });

  // Events
  client.on('guildCreate', guildCreate(client));
  client.on('vote', vote(client));
  client.on('message', mention(client));

  // Middleware
  client.use(logCommands);
  client.use(attachProfile);
  client.use(attachSettings);

  sentiment.setClient(client);

  // Express Server
  const webServer = web(client);

  client
    .login(process.env.TOKEN)
    .then(() => {
      client.logger.info('[Bloo] Log in successful.');
    })
    .catch(err => {
      client.logger.getLogger('critical').error('[Bloo] Could not login to Discord. Exiting...', err);
      process.exit(1);
    });

  // Application Shutdown
  const exitHandler = terminate(webServer, client, { timeout: 1500 });
  process.on('uncaughtException', exitHandler(1, 'Uncaught Exception'));
  process.on('unhandledRejection', exitHandler(1, 'Unhandled Rejection'));
  process.on('SIGTERM', exitHandler(0, 'SIGTERM'));
  process.on('SIGINT', exitHandler(0, 'SIGINT'));
});
