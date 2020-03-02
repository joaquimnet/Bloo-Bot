const { Text } = require('chop-tools');
const { MessageEmbed } = require('discord.js');

const xp = require('../../util/magicformula');
const flatSeconds = require('../../util/flatSeconds');
const { EmbedBuilder } = require('../../services/missions');

module.exports = (pets, message, args, call) => {
  pets.forEach(pet => {
    message.channel.send({
      embed: EmbedBuilder.petDisplay(pet),
    });
  });
};
