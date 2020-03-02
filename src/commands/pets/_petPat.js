const Prompter = require('chop-prompter');

const Pets = require('../../services/pets');
const { PET_PAT_EXP } = require('../../BLOO_GLOBALS');
const { EmbedBuilder } = require('../../services/missions');

module.exports = async (pets, message, args, call, messages) => {
  await message.channel.send(messages.PAT_COOLDOWN);
  pets.forEach(pet => {
    if (!pet.canPat()) {
      return;
    }
    Prompter.confirm({
      channel: message.channel,
      question: {
        embed: EmbedBuilder.petDisplay(pet),
      },
      userId: call.caller,
      confirmEmoji: '🥰',
      cancelEmoji: '🦴',
      // deleteMessage: false,
    }).then(res => {
      if (res !== true) return;
      pet
        .givePat()
        .then(gainedLevelsAmount => {
          message.channel
            .send(
              messages.PAT_PATTED_THE_PET.replace(/\{0\}/g, pet.name).replace(
                /\{1\}/g,
                PET_PAT_EXP,
              ),
            )
            .then(() => {
              if (!gainedLevelsAmount) return;
              Pets.buildLevelUpImage(pet.image).then(img => {
                message.channel.send({ files: [img] });
              });
            });
        })
        .catch(() => {
          /* bruh */
        });
    });
  });
};
