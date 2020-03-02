const { Command } = require('chop-tools');
const toCron = require('human-to-cron');
const toHuman = require('cronstrue').toString;
const chrono = require('chrono-node');
const { moment } = require('../../services/time');

module.exports = new Command({
  name: 'timing',
  description: 'Parse timing into cron and back.',
  category: 'admin',
  hidden: true,
  run(message, args, call) {
    const msg = call.content;
    let cron = null;
    let human = null;
    let relative = null;
    try {
      cron = toCron(msg);
    } catch {
      /* ok */
    }
    try {
      human = toHuman(msg);
    } catch {
      /* ok */
    }
    try {
      relative = chrono.parseDate(msg);
    } catch {
      /* ok */
    }
    this.send(
      `Original: ${msg}`,
      `Cron expression: ${cron}`,
      `Human readable: ${human}`,
      `Relative time: ${moment(relative).fromNow()}`,
    );
  },
});
