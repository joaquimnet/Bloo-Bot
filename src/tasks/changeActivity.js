const { Task } = require('chop-tools');

const random = require('../util/random');

module.exports = class extends Task {
  constructor() {
    // Every 20 secs
    super('Change Activity', 'repeat', '*/20 * * * * *');
  }

  async run() {
    // Possible types: PLAYING STREAMING LISTENING WATCHING
    const options = [
      ['the sunset', { type: 'WATCHING' }],
      ['in the ocean', {type: 'SWIMMING'}],
      ['in a field of flowers', { type: 'PLAYING' }],
      [`${this.client.options.prefix}help`, { type: 'LISTENING' }],
    ];
    const pick = random(options);
    try {
      this.client.user.setActivity(pick[0], pick[1]);
    } catch {
      /* First time this runs it'll throw because bot isn't up yet */
    }
  }
};
