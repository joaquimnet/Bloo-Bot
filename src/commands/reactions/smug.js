const { Command } = require('chop-tools');

const createReactionCommand = require('./_createReactionCommand');

module.exports = new Command({
  name: 'smug',
  description: 'teehee gottem~',
  aliases: [],
  category: 'reactions',
  examples: [' ', '@Lar#9547', '@Xlilblu#5239'],
  run: createReactionCommand({
    msgTarget: '%user is smug. How do you feel %target? ~',
    msgNoTarget: '%user is feeling awfully smug ~',
    gif: 'smug',
  }),
});
