const { Command } = require('chop-tools');

const createReactionCommand = require('../reactions/_createReactionCommand');

module.exports = new Command({
  name: 'sorry',
  description: "Apologize to someone if you did something you shouldn't. >n<",
  args: ['target'],
  delete: true,
  category: 'reactions',
  usage: '[target]',
  examples: [' ', '@Lar#9547', '@Xlilblu#5239'],
  run: createReactionCommand({
    msgTarget: '%user is very sorry, %target.',
    msgNoTarget: "%user's feeling sorry. :flushed:",
    gif: 'shy',
  }),
});
