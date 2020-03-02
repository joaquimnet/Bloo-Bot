const { Command } = require('chop-tools');

const createInteractionCommand = require('../../util/createInteractionCommand');

module.exports = new Command({
  name: 'propose',
  description:
    'Propose to that special someone and ask them to marry you. Or, you know, give someone a heart attack! >u< :blue_heart:',
  args: ['target'],
  aliases: ['marry', 'proposeto'],
  delete: false,
  category: 'interactions',
  usage: '{target}',
  examples: ['@Lar#9547', '@Xlilblu#5239'],
  run(message, args, call) {
    const propose = createInteractionCommand(
      `\n${call.callerTag} has asked you to marry them :hugging:`,
      'shy',
      message,
    );

    propose().catch(err => this.client.emit('error', err));
  },
});
