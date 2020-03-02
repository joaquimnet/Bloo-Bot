const { Command } = require('chop-tools');

const makeEmbed = require('../../util/makeEmbed');

module.exports = new Command({
  name: 'avatar',
  description: "Displays someone's avatar.",
  category: 'other',
  aliases: ['pfp'],
  args: ['target'],
  usage: '{@Name}',
  example: '@Xlilblu',
  run(message) {
    const target = message.mentions.members.first();
    if (!target) {
      this.send("I couldn't find that person.");
      return;
    }

    this.send({
      embed: makeEmbed(target.user.tag + "'s Avatar", target.user.displayAvatarURL({ size: 512 }), message),
    });
  },
});
