const { Command } = require('chop-tools');

const createInteractionCommand = require('./_createInteractionCommand');

module.exports = new Command({
  name: 'lick',
  description: 'okay.. this is pretty self explanatory',
  args: ['target'],
  delete: true,
  category: 'interactions',
  usage: '{target}',
  examples: ['@Lar#9547', '@Xlilblu#5239'],
  run: createInteractionCommand({
    msg: `Well.. How do I say this..\n \n%user has licked you. And now, I will proceed to walk away... :zany_face: `,
    gif: 'lick',
  }),
});
