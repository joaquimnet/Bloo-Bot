const { Command } = require('chop-tools');

const createInteractionCommand = require('./_createInteractionCommand');

module.exports = new Command({
  name: 'poke',
  description: 'poke a cutie',
  args: ['target'],
  delete: true,
  category: 'interactions',
  usage: '{target}',
  examples: ['@Lar#9547', '@Xlilblu#5239'],
  run: createInteractionCommand({
    msg: `%user poked you :yum:\nPoke them back LMAO`,
    gif: 'poke',
  }),
});
