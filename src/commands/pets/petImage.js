const { Command } = require('chop-tools');
const { MessageEmbed } = require('discord.js');

const Pets = require('../../services/pets');
const Pet = require('../../models/pet');

module.exports = new Command({
  name: 'petimage',
  description: 'Pet image testing',
  category: 'pet',
  hidden: true,
  async run(message, args, call) {
    const pet = await Pet.findOne({ owner: call.caller });
    message.channel.send({
      files: [{ name: 'pet.png', attachment: await Pets.buildLevelUpImage(pet.image) }],
    });
  },
});
