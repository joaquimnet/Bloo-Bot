const { Command } = require('chop-tools');

const createReactionCommand = require('./_createReactionCommand');

module.exports = new Command({
  name: 'tired',
  description: 'Someone is looking a little sleeeeeepyyyyyy. Aw how cute! ~',
  aliases: ['sleepy', 'yawn', 'sleep'],
  category: 'reactions',
  usage: '[target]',
  examples: [' ', '@Lar#9547', '@Xlilblu#5239'],
  run: createReactionCommand({
    msgTarget: '%user is telling %target that they are sleepy.',
    msgNoTarget: "%user's feeling awfully sleepy :yawning_face:",
    gif: 'sleepy',
  }),
});
