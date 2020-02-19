const Prompter = require('chop-prompter');
const Filter = require('bad-words');
const match = require('string-similarity').findBestMatch;

const Currency = require('../../services/currency');

const {
  PET_RENAMING_PRICE,
  PET_MAX_NAME_LENGTH,
} = require('../../BLOO_GLOBALS');

module.exports = async (pets, message, args, call, messages) => {
  // Name Restrictions
  const filter = new Filter();

  if (pets.length < 1) {
    message.channel.send(messages.RENAME_NO_PETS);
    return;
  }

  if (call.profile.money < PET_RENAMING_PRICE) {
    message.channel.send(messages.RENAME_NO_MONEY.replace(/\{0\}/g, PET_RENAMING_PRICE));
    return;
  }

  let petToRename = null;

  // more than 1 pet
  if (pets.length > 1) {
    while (!petToRename) {
      // eslint-disable-next-line no-await-in-loop
      const res = await Prompter.message({
        channel: message.channel,
        question: messages.RENAME_WHICH_PET.replace(/\{0\}/g, pets.map(p => p.name).join(', ')),
        userId: call.caller,
        max: 1,
        deleteMessage: false,
      });

      if (res) {
        const chosenPetName = res
          .first()
          .content.trim()
          .toLowerCase();
        petToRename = pets.find(p => p.name.toLowerCase() === chosenPetName);
        if (!petToRename) {
          const { bestMatch } = match(
            chosenPetName,
            pets.map(p => p.name),
          );
          const bestMatchName = bestMatch.target;
          // eslint-disable-next-line no-await-in-loop
          const didWeGetIt = await Prompter.confirm({
            channel: message.channel,
            question: messages.RENAME_PET_NOT_FOUND.replace(/\{0\}/g, bestMatchName),
            userId: call.caller,
          });
          if (didWeGetIt === true) {
            petToRename = pets.find(p => p.name === bestMatchName);
            break;
          }
        }
      }
    }
    // only 1 pet
  } else {
    petToRename = pets[0];
  }

  // teehee okiedokieartichokie ~~~
  const response = await Prompter.confirm({
    channel: message.channel,
    question: messages.RENAME_ARE_YOU_SURE.replace(/\{0\}/g, PET_RENAMING_PRICE),
    userId: call.caller,
  });

  if (response !== true) {
    message.channel.send(messages.FANCY_OKAY);
    return;
  }

  // ~~~oowoo~~~ 👍
  const responseList = await Prompter.message({
    channel: message.channel,
    question: messages.RENAME_ASK_NEW_NAME,
    userId: call.caller,
    deleteMessage: false,
  });

  const newName = responseList ? responseList.first().content.trim() : '';

  if (!newName) {
    message.channel.send(messages.SILLY_OKAY);
    return;
  }

  if (filter.isProfane(newName)) {
    message.channel.send(messages.RENAME_NAME_HAS_PROFANITY);
    return;
  }

  if (/[^a-z ]/gi.test(newName)) {
    message.channel.send(messages.RENAME_NAME_HAS_SYMBOLS);
    return;
  }

  if (newName > PET_MAX_NAME_LENGTH) {
    message.channel.send(messages.RENAME_NAME_TOO_LONG);
    return;
  }

  petToRename.name = newName;

  let balance = await Currency.getBalance(call.caller);

  try {
    if (balance < PET_RENAMING_PRICE) {
      message.channel.send(messages.RENAME_BALANCE_CHANGED_DURING_RENAMING);
      return;
    }
    await petToRename.save();
  } catch {
    message.channel.send(messages.SOMETHING_WENT_WRONG);
    return;
  }

  balance = await Currency.subtract(call.caller, PET_RENAMING_PRICE);

  message.channel.send(
    messages.RENAME_SUCCESS.replace(/\{0\}/g, newName).replace(/\{1\}/g, balance),
  );
  return;
};
