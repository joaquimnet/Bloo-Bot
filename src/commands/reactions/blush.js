const { Command } = require('chop-tools');

const createReactionCommand = require('./_createReactionCommand');

module.exports = new Command({
  name: 'blush',
  description: "~Teehee you're looking awfully red~",
  aliases: ['embarrassed'],
  category: 'reactions',
  usage: '[target]',
  examples: [' ', '@Lar#9547', '@Xlilblu#5239'],
  run: createReactionCommand({
    msgTarget: '%user is blushing because of %target.',
    msgNoTarget: "%user's blushing. :flushed:",
    gif: 'blush',
  }),
});
