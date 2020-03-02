const { Command } = require('chop-tools');

const createReactionCommand = require('./_createReactionCommand');

module.exports = new Command({
  name: 'happy',
  description: "show that you're happy!",
  aliases: ['joy', 'content'],
  category: 'reactions',
  usage: '[target]',
  examples: [' ', '@Lar#9547', '@Xlilblu#5239'],
  run: createReactionCommand({
    msgTarget: '%target has made %user happy!',
    msgNoTarget: '%user seems to be really happy!',
    gif: 'happy',
  }),
});
