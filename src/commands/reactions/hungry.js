const { Command } = require('chop-tools');

const createReactionCommand = require('./_createReactionCommand');

module.exports = new Command({
  name: 'hungry',
  description: 'we all get a little hungry sometimes',
  aliases: ['starving', 'famished'],
  category: 'reactions',
  usage: '[target]',
  examples: [' ', '@Lar#9547', '@Xlilblu#5239'],
  hidden: true,
  run: createReactionCommand({
    msgTarget: '%user wants to tell %target that they are very hungry. I suggest you feed them.',
    msgNoTarget: "%user is saying that they're hungry! :fork_knife_plate:",
    gif: 'hungry',
  }),
});
