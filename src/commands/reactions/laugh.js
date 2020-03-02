const { Command } = require('chop-tools');

const createReactionCommand = require('./_createReactionCommand');

module.exports = new Command({
  name: 'laugh',
  description: 'Lmao! :laughing:',
  aliases: ['laughing', 'laughter'],
  category: 'reactions',
  examples: [' ', '@Lar#9547', '@Xlilblu#5239'],
  run: createReactionCommand({
    msgTarget: '%user is laughing at %target. :laughing: How funny!',
    msgNoTarget: "%user's laughing :laughing:",
    gif: 'laugh',
  }),
});
