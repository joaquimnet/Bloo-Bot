const Prompter = require('chop-prompter');

const Pet = require('../../models/pet');
const Currency = require('../../services/currency');
const { PET_ABANDON_RETURN_MONEY } = require('../../BLOO_GLOBALS');

module.exports = async (pets, message, args, call, messages) => {
  if (pets.length < 1) {
    message.channel.send(messages.ABANDON_YOU_HAVE_NO_PETS);
    return;
  }

  let petToDelete = null;

  // more than 1 pet
  if (pets.length > 1) {
    const res = await Prompter.message({
      channel: message.channel,
      question: messages.ABANDON_WHICH_PET.replace(/\{0\}/g, pets.map(p => p.name).join(', ')),
      userId: call.caller,
      max: 1,
      deleteMessage: false,
    });

    if (res) {
      const chosenPetName = res
        .first()
        .content.trim()
        .toLowerCase();
      petToDelete = pets.find(p => p.name.toLowerCase() === chosenPetName);
    }

    if (!petToDelete) {
      message.channel.send(messages.ABANDON_PET_NOT_FOUND);
      return;
    }
    // only 1 pet
  } else {
    petToDelete = pets[0];
  }

  const shouldDeletePet = await Prompter.confirm({
    channel: message.channel,
    question: messages.ABANDON_ARE_YOU_SURE,
    userId: call.caller,
  });
  if (shouldDeletePet !== true) {
    // ✅ ✖ -> user chose no.... KAFFE
    message.channel.send(messages.ABANDON_WILL_NOT_ABANDON_PET);
    return;
  }

  // eslint-disable-next-line
  await Pet.deleteOne({ _id: petToDelete._id }).exec();
  await Currency.add(call.caller, PET_ABANDON_RETURN_MONEY);
  message.channel.send(messages.ABANDON_PET_ABANDONED.replace(/\{0\}/g, petToDelete.name));
};
