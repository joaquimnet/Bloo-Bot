const { Command } = require('chop-tools');

const createInteractionCommand = require('./_createInteractionCommand');

module.exports = new Command({
  name: 'stare',
  description: 'o-o',
  args: ['target'],
  aliases: ['glare'],
  //  ¯\_(ツ)_/¯
  category: 'interactions',
  examples: ['@Lar#9547', '@Xlilblu#5239'],
  run: createInteractionCommand({
    msg: `%user is staring at you... what did you do?`,
    gif: 'stare',
  }),
});
