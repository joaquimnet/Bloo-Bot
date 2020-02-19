const Prompter = require('chop-prompter');
const { MessageEmbed } = require('discord.js');

const Pet = require('../../models/pet');
const Pets = require('../../services/pets');
const Currency = require('../../services/currency');
const { PET_PRICE, MAX_PET_COUNT } = require('../../BLOO_GLOBALS');

module.exports = async (pets, message, args, call, messages) => {
  const response = await Prompter.confirm({
    channel: message.channel,
    question: messages.ADOPT_ARE_YOU_SURE,
    userId: call.caller,
  });
  if (response !== true) {
    message.channel.send(messages.GENERIC_OKAY);
    return;
  }

  // monie check
  if (call.profile.money < PET_PRICE) {
    message.channel.send(messages.ADOPT_NOT_ENOUGH_BLOO_INK);
    return;
  }

  // pet count check
  if (pets.length >= MAX_PET_COUNT) {
    message.channel.send(messages.ADOPT_CANT_ADOPT_MORE_PETS);
    return;
  }

  // create the pet
  const petName = Pets.generateRandomName();
  const petImage = await Pets.buildImage(Pets.generateImageRecipe());
  const pet = new Pet({
    name: petName,
    owner: call.caller,
    image: petImage,
  });

  // remove the monies
  await Currency.subtract(call.caller, PET_PRICE);

  // save pet
  await pet.save();

  // if we got to here there were no errors! \o/

  // response
  const embed = new MessageEmbed({
    title: 'Pet adopted!',
    description: messages.ADOPT_SUCCESS.replace(/\{0\}/, message.author).replace(/\{1\}/, petName),
    files: [{ name: 'pet.png', attachment: petImage }],
    thumbnail: { url: 'attachment://pet.png' },
    color: 0x009900,
  });
  message.channel.send({ embed });
};
