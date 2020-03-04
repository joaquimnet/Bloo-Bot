const { Command } = require('chop-tools');

const createInteractionCommand = require('./_createInteractionCommand');

// cute stuff c;
module.exports = new Command({
  name: 'cute',
  aliases: ['pretty'],
  description: "Tell someone they're cute :smiling_face_with_3_hearts:",
  args: ['target'],
  delete: true,
  category: 'interactions',
  usage: '{target}',
  examples: ['@Lar#9547', '@Xlilblu#5239'],
  run: createInteractionCommand({
    msg: `Hey there! \n%user said you're cute. ;)`,
    gif: 'cute',
  }),
});
