const { MessageEmbed } = require('discord.js');

module.exports = function makeEmbed(text, image, message, attachment) {
  const embedData = {
    author: { name: message.author.username, iconURL: message.author.avatarURL() },
    footer: {
      text: '<3',
      icon_url: message.client.user.avatarURL(),
    },
    description: text,
  };

  if (attachment) {
    embedData.image = { url: 'attachment://MyStomachIsHurtingSoMuchRightNow.png' };
    embedData.files = [{ name: 'MyStomachIsHurtingSoMuchRightNow.png', attachment: image }];
  } else {
    embedData.image = { url: image };
  }

  const embed = new MessageEmbed(embedData);

  return embed;
};
