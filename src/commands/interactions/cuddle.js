const { Command } = require('chop-tools');

const createInteractionCommand = require('./_createInteractionCommand');

module.exports = new Command({
  name: 'cuddle',
  description: "well... it's what it says",
  args: ['target'],
  delete: true,
  category: 'interactions',
  usage: '{target}',
  examples: ['@Lar#9547', '@Xlilblu#5239'],
  run: createInteractionCommand({
    msg: `%user has decided that they want to cuddle you. Hope I didn't make it weird o3o :hugging:`,
    gif: 'cuddle',
  }),
});
