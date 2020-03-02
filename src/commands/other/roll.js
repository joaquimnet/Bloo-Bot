const { Command } = require('chop-tools');

module.exports = new Command({
  name: 'roll',
  description: 'Rolls a die :game_die: ',
  category: 'funny',
  run() {
    const roll = Math.floor(Math.random() * 6) + 1;
    const emotes = ['one', 'two', 'three', 'four', 'five', 'six'];
    this.send(`You rolled a :${emotes[roll - 1]}:`);
  },
});
