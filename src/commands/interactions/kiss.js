const { Command } = require('chop-tools');

const createInteractionCommand = require('./_createInteractionCommand');
const format = require('../../util/format');

module.exports = new Command({
  name: 'kiss',
  description: 'kiss a cutie you know',
  args: ['target'],
  delete: true,
  category: 'interactions',
  usage: '{target}',
  examples: ['@Lar#9547', '@Xlilblu#5239'],
  run: createInteractionCommand({
    msg: format(
      `\n%user has kissed you.`,
      "My... you're looking quite flustered..",
      'Do you want me to turn a fan on to help you cool down?',
    ),
    gif: 'kiss',
  }),
});
