const { Command } = require('chop-tools');

const createInteractionCommand = require('./_createInteractionCommand');

module.exports = new Command({
  name: 'propose',
  description:
    'Propose to that special someone and ask them to marry you. Or, you know, give someone a heart attack! >u< :blue_heart:',
  args: ['target'],
  aliases: ['marry', 'proposeto'],
  delete: false,
  category: 'interactions',
  usage: '{target}',
  examples: ['@Lar#9547', '@Xlilblu#5239'],
  run: createInteractionCommand({
    msg: `\n%user has asked you to marry them :hugging:`,
    gif: 'shy',
  }),
});
