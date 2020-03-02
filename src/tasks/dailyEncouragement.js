const { Task } = require('chop-tools');

const random = require('../util/random');
const format = require('../util/format');
const { encouragementList } = require('../services/encouragements');
const Bloo = require('../models/bloo');

module.exports = class extends Task {
  constructor() {
    // Every day at 7am and at 12pm
    super('Daily Encouragement', 'repeat', '0 17 * * *');
  }

  async run() {
    const userIds = await Bloo.getEncouragementList();
    userIds.forEach(id => {
      const user = this.client.users.get(id);
      if (user) {
        user.send(format(random(encouragementList)));
      }
    });
  }
};
