const { Text } = require('chop-tools');
const Prompter = require('chop-prompter');
const { MessageEmbed } = require('discord.js');

const { PET_PAT_EXP } = require('../../BLOO_GLOBALS');
const flatSeconds = require('../../util/flatSeconds');
const xp = require('../../util/magicformula');

module.exports = async (pets, message, args, call, messages) => {
  await message.channel.send(messages.PAT_COOLDOWN);
  pets.forEach(pet => {
    const lastPatDate = pet.pats.time;
    if (Date.now() - lastPatDate.getTime() < 1800000) return;
    Prompter.confirm({
      channel: message.channel,
      question: {
        embed: new MessageEmbed({
          title: pet.name,
          description: Text.lines(
            `⭐ **Level:** __${pet.level}__`,
            `✨ **Experience:** __${pet.experience}/${xp.expToNextLevel(pet.level)}__`,
            `💕 **Pats:** __${pet.pats.count}__`,
            Text.duration(
              `**Last pat:** __{duration:${flatSeconds(
                Date.now() - lastPatDate.getTime(),
              )}}__ ago.`,
            ),
          ),
          files: [{ name: 'pet.png', attachment: pet.image }],
          thumbnail: { url: 'attachment://pet.png' },
        }),
      },
      userId: call.caller,
      confirmEmoji: '🥰',
      cancelEmoji: '🦴',
      // deleteMessage: false,
    }).then(res => {
      if (res !== true) return;
      pet
        .givePat()
        .then(() => {
          message.channel.send(
            messages.PAT_PATTED_THE_PET.replace(/\{0\}/g, pet.name).replace(/\{1\}/g, PET_PAT_EXP),
          );
        })
        .catch(() => {
          /* bruh */
        });
    });
  });
};
