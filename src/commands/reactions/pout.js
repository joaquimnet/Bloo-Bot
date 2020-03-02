const { Command } = require('chop-tools');

const createReactionCommand = require('./_createReactionCommand');

module.exports = new Command({
  name: 'pout',
  description: 'For when someone is just being a baka.',
  // aliases: [],
  category: 'reactions',
  examples: [' ', '@Lar#9547', '@Xlilblu#5239'],
  run: createReactionCommand({
    msgTarget: "%user is pouting at %target. Whatever you do.. :pleading_face: *don't* give in.",
    msgNoTarget: "%user's pouting :pleading_face:",
    gif: 'pout',
  }),
});
