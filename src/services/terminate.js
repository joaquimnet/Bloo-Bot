const mongoose = require('mongoose');
const { DiscordAPIError } = require('discord.js');

const logger = require('./logger');
const Alert = require('./alert');

function terminate(web, discord, options = { timeout: 500 }) {
  // Exit function
  const exit = code => process.exit(code);

  return (code, reason) => (err, promise) => {
    logger.info(`Process exiting with code ${code}, reason: ${reason}`);

    if (err) {
      if (reason === 'Unhandled Rejection') {
        logger.error('Rejected promise:', promise, 'Error:', err);
        if (err instanceof DiscordAPIError || promise instanceof DiscordAPIError) {
          return;
        }
        Alert.log(
          Alert.types.error,
          discord,
          `Omg <@517599684961894400> is going to be so mad :cold_sweat:
        \`\`\`${err}\`\`\``,
          // eslint-disable-next-line no-console
        ).catch(console.error);
        // lets not kill Bloo for an unhandledRejection
        return;
      }
      logger.error(err.message, err.stack);
      Alert.critical(
        Alert.types.catastrophic_error,
        discord,
        `Omg <@517599684961894400> is going to be so mad :cold_sweat:
        \`\`\`${err.message}\n\n${err.stack}\`\`\``,
        // eslint-disable-next-line no-console
      ).catch(console.error); // console here because termination
    }

    // Try a graceful shutdown
    mongoose.disconnect();
    discord.destroy();
    web.close(exit);
    // Force the shutdown
    setTimeout(exit, options.timeout).unref();
  };
}

module.exports = terminate;
