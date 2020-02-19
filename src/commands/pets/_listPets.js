const { Text } = require('chop-tools');
const { MessageEmbed } = require('discord.js');

const xp = require('../../util/magicformula');
const flatSeconds = require('../../util/flatSeconds');

module.exports = (pets, message, args, call) => {
  pets.forEach(pet => {
    const lastPatDate = pet.pats.time;
    message.channel.send({
      embed: new MessageEmbed({
        title: pet.name,
        description: Text.lines(
          `⭐ **Level:** __${pet.level}__`,
          `✨ **Experience:** __${pet.experience}/${xp.expToNextLevel(pet.level)}__`,
          `💕 **Pats:** __${pet.pats.count}__`,
          Text.duration(
            `**Last pat:** __{duration:${flatSeconds(Date.now() - lastPatDate.getTime())}}__ ago.`,
          ),
        ),
        files: [{ name: 'pet.png', attachment: pet.image }],
        thumbnail: { url: 'attachment://pet.png' },
      }),
    });
  });
};
