const { MessageEmbed } = require('discord.js');
const nodemailer = require('nodemailer');

const Bloo = require('../models/bloo');
const logger = require('../services/logger');

const messages = {
  0: 'Possibly suicidal message detected.',
  1: '__***Catastrophic Error!!!***__ Please take action immediately! ⚠ ⚠ ⚠ ',
  2: "We've received a new piece of feedback! :D",
  3: 'Bloo got invited into a new server! 🎉',
  4: '⚠️ An error occurred! ⚠️',
  5: '📥 Bloo got a new vote!',
  6: '✨ SOMEONE HIT THE JACKPOT LUL!!!!'
};

const transport = nodemailer.createTransport({
  host: process.env.MAIL_SERVER,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  secure: false,
  tls: { rejectUnauthorized: false },
});

module.exports = class Alert {
  static types = {
    suicide: 0,
    catastrophic_error: 1,
    feedback: 2,
    invited: 3,
    error: 4,
    vote: 5,
    jackpot: 6,
  };

  static async critical(type, client, message) {
    const blooConfig = await Bloo.findOne({}).exec();
    if (!blooConfig) {
      client.emit('error', new Error('Bloo config is missing!'));
      return;
    }

    const guild = client.guilds.get(blooConfig.alerts.guild);

    if (!guild) {
      client.emit('error', new Error('Alerts guild is missing in Bloo Config!'));
      return;
    }

    const channel = guild.channels.get(blooConfig.alerts.channel);

    if (!channel) {
      client.emit('error', new Error('Alerts channel is missing in Bloo Config!'));
      return;
    }

    if (channel.type !== 'text') {
      client.emit('error', new Error('Alerts channel in Bloo Config is not a text channel!'));
      return;
    }

    channel.send({ embed: new MessageEmbed({ title: messages[type], description: message }) });
    transport.sendMail(
      {
        from: 'Bloo Bot <bloobotdev@gmail.com',
        to: 'Joaquim Neto <joaquimmy@yahoo.com>, Blu <xlilblu666@gmail.com>',
        subject: 'Bloo Alert',
        text: messages[type] + '\n\n' + message,
      },
      (err, info) => {
        if (err) {
          logger.error(err);
        } else {
          logger.info(info);
        }
      },
    );
  }

  static async log(type, client, message, data) {
    const blooConfig = await Bloo.findOne({}).exec();
    if (!blooConfig) {
      client.emit('error', new Error('Bloo config is missing!'));
      return;
    }

    const guild = client.guilds.get(blooConfig.logs.guild);

    if (!guild) {
      client.emit('error', new Error('Logs guild is missing in Bloo Config!'));
      return;
    }

    const channel = guild.channels.get(blooConfig.logs.channel);

    if (!channel) {
      client.emit('error', new Error('Logs channel is missing in Bloo Config!'));
      return;
    }

    if (channel.type !== 'text') {
      client.emit('error', new Error('Logs channel in Bloo Config is not a text channel!'));
      return;
    }

    const embed = new MessageEmbed({
      title: messages[type],
      description: message,
      thumbnail: data && data.thumbnail ? { url: data.thumbnail } : undefined,
    });
    channel.send({ embed });
  }
};
