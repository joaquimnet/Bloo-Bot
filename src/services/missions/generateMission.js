const random = require('../../util/random');
const names = require('./names.json');
const Mission = require('./mission');

module.exports = difficulty => {
  return new Mission({
    difficulty: difficulty.name,
    mission: random(names[difficulty.name]),
    emoji: difficulty.emoji,
    money: difficulty.money,
    petExp: difficulty.petExp,
    duration: difficulty.duration,
  });
};
