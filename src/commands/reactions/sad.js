
const { Command } = require('chop-tools');

const createReactionCommand = require('./_createReactionCommand');

module.exports = new Command({
  name: 'sad',
  description: "don't cry... things will get better :frown:",
  aliases: ['hurt', 'sad', 'depressed'],
  category: 'reactions',
  usage: '[target]',
  examples: [' ', '@Lar#9547', '@Xlilblu#5239'],
  run: createReactionCommand({
    msgTarget: "%user is crying because of %target. Why would you do that to them? :c",
    msgNoTarget: "%user is sad, someone should try to cheer them up.. :sob:",
    gif: 'sad',
  }),
});
