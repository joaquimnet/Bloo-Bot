const { Command } = require('chop-tools');

const createInteractionCommand = require('./_createInteractionCommand');

module.exports = new Command({
  name: 'gay',
  description: 'Call someone gay. ;P',
  args: ['target'],
  delete: true,
  category: 'interactions',
  usage: '{target}',
  examples: ['@Lar#9547', '@Xlilblu#5239'],
  run: createInteractionCommand({
    msg: `\n%user called you gay ;p\nWatcha gonna do about that?`,
    gif: 'laugh',
  }),
});
