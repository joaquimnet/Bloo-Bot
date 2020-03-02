const { Command } = require('chop-tools');

const createReactionCommand = require('./_createReactionCommand');

module.exports = new Command({
  name: 'confused',
  description: "Ever feel like you don't understand what's going on?",
  aliases: ['confuse', 'huh', 'confusion'],
  category: 'reactions',
  examples: [' ', '@Lar#9547', '@Xlilblu#5239'],
  run: createReactionCommand({
    msgTarget: '%user is confused by what you said, %target Maybe try clarifying a little more?',
    msgNoTarget: '%user is **confused** :thinking:',
    gif: 'confused',
  }),
});
