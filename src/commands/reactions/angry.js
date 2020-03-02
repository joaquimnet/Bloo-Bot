const { Command } = require('chop-tools');

const createReactionCommand = require('./_createReactionCommand');

module.exports = new Command({
  name: 'angry',
  description: "show that you're angry >:(",
  aliases: ['angery', 'irate', 'mad', 'upset', 'irritated'],
  category: 'reactions',
  usage: '[target]',
  examples: [' ', '@Lar#9547', '@Xlilblu#5239'],
  run: createReactionCommand({
    msgTarget: 'Beware %target. %user is very angry at you.',
    msgNoTarget: '**Caution** %user seems to be really angry.',
    gif: 'angry',
  }),
});
