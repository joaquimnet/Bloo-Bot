const { Command } = require('chop-tools');

const createReactionCommand = require('./_createReactionCommand');

module.exports = new Command({
  name: 'cry',
  description: 'sometimes.. you just gotta cry it out',
  aliases: ['sob', 'tear'],
  category: 'reactions',
  examples: [' ', '@Lar#9547', '@Xlilblu#5239'],
  run: createReactionCommand({
    msgTarget: "%target made %user cry, what did you do? :'c ",
    msgNoTarget: "%user's crying. :'(",
    gif: 'cry',
  }),
});
