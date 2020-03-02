const { Command } = require('chop-tools');

const createReactionCommand = require('./_createReactionCommand');

module.exports = new Command({
  name: 'smile',
  description: 'For when something good happens.',
  category: 'reactions',
  usage: '[target]',
  examples: [' ', '@Lar#9547', '@Xlilblu#5239'],
  run: createReactionCommand({
    msgTarget: '%user is smilling because of you %target.',
    msgNoTarget: '%user is smilling, how joyful.',
    gif: 'smile',
  }),
});
