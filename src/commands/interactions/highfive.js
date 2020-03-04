const { Command } = require('chop-tools');

const createInteractionCommand = require('./_createInteractionCommand');

module.exports = new Command({
  name: 'highfive',
  description: 'let your buddies know what they did was awesome! :grin:',
  args: ['target'],
  delete: true,
  category: 'interactions',
  usage: '{target}',
  examples: ['@Lar#9547', '@Xlilblu#5239'],
  run: createInteractionCommand({
    msg: `\n%user has high-fived you :raised_hand: :pray: good job, on whatever you did to deserve a high-five :grin:`,
    gif: 'highfive',
  }),
});
// nice :ok_hand: 👌
