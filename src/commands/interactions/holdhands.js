const { Command } = require('chop-tools');

const createInteractionCommand = require('./_createInteractionCommand');

// cute stuff c;
module.exports = new Command({
  name: 'hold',
  description: 'Tell someone you want to hold their hand :heart:',
  args: ['target'],
  delete: true,
  category: 'interactions',
  usage: '{target}',
  examples: ['@Lar#9547', '@Xlilblu#5239'],
  run: createInteractionCommand({
    msg: `I was sent by \n%user to ask if you'd like to hold their hand :smiling_face_with_3_hearts:`,
    gif: 'holdhands',
  }),
});
