const { Command } = require('chop-tools');

const createReactionCommand = require('./_createReactionCommand');

module.exports = new Command({
  name: 'coffee',
  description: 'A cup of coffee to boost your spirits. ;)',
  aliases: ['kaffe'],
  category: 'reactions',
  examples: [' ', '@Lar#9547', '@Xlilblu#5239'],
  run: createReactionCommand({
    msgTarget: '%user is drinking a cup of coffee. Would you like one too, %target? :coffee:',
    msgNoTarget: "%user's drinking a cup of coffee :coffee:",
    gif: 'coffee',
  }),
});
