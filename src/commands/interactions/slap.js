const { Command } = require('chop-tools');

const createInteractionCommand = require('./_createInteractionCommand');

module.exports = new Command({
  name: 'slap',
  description: 'slap someone when they need it',
  args: ['target'],
  delete: true,
  category: 'interactions',
  usage: '{target}',
  examples: ['@Lar#9547', '@Xlilblu#5239'],
  run: createInteractionCommand({
    msg: `*slap* \n%user sent me to slap you... you seemed like you needed some common sense sent your way. :yum: `,
    gif: 'slap',
  }),
});
