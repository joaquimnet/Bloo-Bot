const { Task } = require('chop-tools');

const random = require('../util/random');
const format = require('../util/format');

const encouragements = [
  'The day ends at midnight.',
  'You matter.'
]

module.exports = class extends Task {
  constructor() {
    // Every day at 7am and at 7pm
    super('Daily Encouragement', 'repeat', '0 0,12 * * * *');
  }

  async run() {
    const users = [];
    users.forEach(user => {
      user.send(format(random(encouragements)));
    });
  }
};
