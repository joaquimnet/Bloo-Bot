const { Command } = require('chop-tools');

const createInteractionCommand = require('../../util/createInteractionCommand');

module.exports = new Command({
  name: 'sorry',
  description: "Apologize to someone if you did something you shouldn't. >n<",
  args: ['target'],
  delete: true,
  category: 'interactions',
  usage: '{target}',
  examples: ['@Lar#9547', '@Xlilblu#5239'],
  async run(message, args, call) {
    const sorry = createInteractionCommand(
      `\n${call.callerTag} says they're so sorry for what they did. >n<`,
      'shy',
      message,
    );

    sorry().catch(err => this.client.emit('error', err));
  },
});
