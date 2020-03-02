const { Command } = require('chop-tools');

const createInteractionCommand = require('../../util/createInteractionCommand');

module.exports = new Command({
  name: 'gay',
  description: 'Call someone gay. ;P',
  args: ['target'],
  delete: true,
  category: 'interactions',
  usage: '{target}',
  examples: ['@Lar#9547', '@Xlilblu#5239'],
  async run(message, args, call) {
    const gay = createInteractionCommand(
      `\n${call.callerTag} called you gay ;p`,
      'laugh',
      message,
    );

    gay().catch(err => this.client.emit('error', err));
  },
});
