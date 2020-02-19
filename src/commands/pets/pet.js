const { Command, Text } = require('chop-tools');
const Prompter = require('chop-prompter');
const { MessageEmbed } = require('discord.js');
const Filter = require('bad-words');
const match = require('string-similarity').findBestMatch;

const Pet = require('../../models/pet');
const Pets = require('../../services/pets');
const Currency = require('../../services/currency');
const format = require('../../util/format');
const {
  INK_EMOJI,
  PET_PRICE,
  MAX_PET_COUNT,
  PET_ABANDON_RETURN_MONEY,
  PET_PAT_COOLDOWN,
  PET_PAT_EXP,
  PET_RENAMING_PRICE,
  PET_MAX_NAME_LENGTH,
} = require('../../BLOO_GLOBALS');
const flatSeconds = require('../../util/flatSeconds');
const xp = require('../../util/magicformula');

const topPets = require('./_topPets');
const listPets = require('./_listPets');

const messages = {
  // General
  GENERIC_OKAY: 'Okay then.',
  FANCY_OKAY: 'Okie Dokie Artichokie.',
  SILLY_OKAY: 'Alrighty then.',
  SOMETHING_WENT_WRONG: 'Something went wrong. :c',
  // Adoption
  ADOPT_ARE_YOU_SURE: `Are you sure? That will cost you **${PET_PRICE}${INK_EMOJI}**`,
  ADOPT_NOT_ENOUGH_BLOO_INK: `You don't have enough Bloo Ink${INK_EMOJI} to adopt a pet. :c`,
  ADOPT_CANT_ADOPT_MORE_PETS: "You can't adopt any more pets. :c",
  ADOPT_SUCCESS: `Congratulations, {0}!\nYou just adopted an adorable pet named **{1}**.`,
  // Abandoning
  ABANDON_WHICH_PET: format(
    'Which pet would you like to throw away forever? **{0}**?',
    "I can't believe I have to be the bearer of bad news and tell them their master doesn't love them anymore.",
    "Please don't do this :frowning:",
  ),
  ABANDON_ARE_YOU_SURE:
    "Are you sure you would like to do this? There isn't a possibility of getting the same pet back. And you may hurt their *feelings* :c \n**Please confirm that you would like to do this.**",
  ABANDON_PET_ABANDONED:
    'You have gotten rid of your pet **{0}**. \n \nI bet you feel bad now.. *How could you?* :frowning:',
  ABANDON_YOU_HAVE_NO_PETS:
    "I hate to see this... You really don't like pets to the point... That you tried... To get rid.. Of a pet, that __***doesn't exist***__.",
  ABANDON_PET_NOT_FOUND:
    "I do not see a pet under that name, maybe see if you are spelling it correctly? Or.... maybe you shouldn't get rid of your pet :smile: \nBut if you are serious about wanting to abandon your pet, please check your spelling and try again!",
  ABANDON_WILL_NOT_ABANDON_PET:
    '**Phew.** Thank goodness you decided not to! Thank you for having a heart.',
  // Patting
  PAT_PATTED_THE_PET: 'You have pat your pet **{0}** for **{1}** exp!',
  PAT_COOLDOWN: `You can pat your pets every **${PET_PAT_COOLDOWN}** minutes.`,
  // Renaming
  RENAME_NO_PETS: "You don't have a pet to rename.",
  RENAME_NO_MONEY:
    "Renaming costs {0}. You do not have enough funds to rename your pet. Please consider voting for me (**!b vote**) to gather more Blue Ink, or use **!b daily** if you haven't already!",
  RENAME_WHICH_PET: 'Which pet would you like to rename? **{0}**?',
  RENAME_PET_NOT_FOUND: 'I do not see a pet under this name; did you mean **{0}**?',
  RENAME_ARE_YOU_SURE: 'Are you sure you would like to rename your pet? That will cost **{0}**.',
  RENAME_ASK_NEW_NAME: "What would you like your pet's new name to be?",
  RENAME_NAME_HAS_PROFANITY: `I'm going to need you to reconsider that name. That is an explicit name that I cannot allow you to name your pet that.`,
  RENAME_NAME_HAS_SYMBOLS: 'Only characters A-Z are allowed in your pets name.',
  RENAME_NAME_TOO_LONG: `That name is too long. Pet names can only be ${PET_MAX_NAME_LENGTH} or less.`,
  RENAME_BALANCE_CHANGED_DURING_RENAMING: 'You do not have enough Bloo ink to rename your pet.',
  RENAME_SUCCESS: `Your pet is now named {0} and you have {1} Bloo Ink.`,
  // Top
  TOP_HEADING: '__Currently these are the best pets!.__',
};

module.exports = new Command({
  name: 'pet',
  description: Text.lines(
    'Trade your Bloo Ink for a pet that you can earn xp and feed!',
    'Use **pet adopt** to adopt one.',
    'Use **pet pat** to pat your pets.',
    'Use **pet rename** to rename your pets.',
    'Use **pet abandon** to get rid of a pet.',
    'Use **pet top** to see the top pets.',
    'You can have a max of 2 pets.',
  ),
  category: 'pets',
  aliases: ['p', 'pets'],
  async run(message, args, call) {
    const pets = await Pet.find({ owner: call.caller }).exec();

    // Arg === adopt
    if (args[0] && ['a', 'adopt'].includes(args[0].toLowerCase())) {
      const response = await Prompter.confirm({
        channel: message.channel,
        question: messages.ADOPT_ARE_YOU_SURE,
        userId: call.caller,
      });
      if (response !== true) {
        this.send(messages.GENERIC_OKAY);
        return;
      }

      // monie check
      if (call.profile.money < PET_PRICE) {
        this.send(messages.ADOPT_NOT_ENOUGH_BLOO_INK);
        return;
      }

      // pet count check
      if (pets.length >= MAX_PET_COUNT) {
        this.send(messages.ADOPT_CANT_ADOPT_MORE_PETS);
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
        description: messages.ADOPT_SUCCESS.replace(/\{0\}/, message.author).replace(
          /\{1\}/,
          petName,
        ),
        files: [{ name: 'pet.png', attachment: petImage }],
        thumbnail: { url: 'attachment://pet.png' },
        color: 0x009900,
      });
      this.send({ embed });
      return;
    }

    // Arg === abandon/yeet/delete
    if (args[0] && ['abandon', 'yeet', 'delete'].includes(args[0].toLowerCase())) {
      // 0 pets
      if (pets.length < 1) {
        this.send(messages.ABANDON_YOU_HAVE_NO_PETS);
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
          this.send(messages.ABANDON_PET_NOT_FOUND);
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
        this.send(messages.ABANDON_WILL_NOT_ABANDON_PET);
        return;
      }

      // eslint-disable-next-line
      await Pet.deleteOne({ _id: petToDelete._id }).exec();
      await Currency.add(call.caller, PET_ABANDON_RETURN_MONEY);
      this.send(messages.ABANDON_PET_ABANDONED.replace(/\{0\}/g, petToDelete.name));
      return;
    }

    // Arg === pat 💕
    if (args[0] && ['pat', 'pet', 'loveon', 'givelove', 'p'].includes(args[0].toLowerCase())) {
      await this.send(messages.PAT_COOLDOWN);
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
              this.send(
                messages.PAT_PATTED_THE_PET.replace(/\{0\}/g, pet.name).replace(
                  /\{1\}/g,
                  PET_PAT_EXP,
                ),
              );
            })
            .catch(() => {
              /* bruh */
            });
        });
      });
      return;
    }

    // arg === rename
    if (
      args[0] &&
      ['rename', 'changename', 'idk', 'helpmebluLOL', 'r'].includes(args[0].toLowerCase())
    ) {
      // Name Restrictions
      const filter = new Filter();

      if (pets.length < 1) {
        this.send(messages.RENAME_NO_PETS);
        return;
      }

      if (call.profile.money < PET_RENAMING_PRICE) {
        this.send(messages.RENAME_NO_MONEY.replace(/\{0\}/g, PET_RENAMING_PRICE));
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
        this.send(messages.FANCY_OKAY);
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
        this.send(messages.SILLY_OKAY);
        return;
      }

      if (filter.isProfane(newName)) {
        this.send(messages.RENAME_NAME_HAS_PROFANITY);
        return;
      }

      if (/[^a-z ]/gi.test(newName)) {
        this.send(messages.RENAME_NAME_HAS_SYMBOLS);
        return;
      }

      if (newName > PET_MAX_NAME_LENGTH) {
        this.send(messages.RENAME_NAME_TOO_LONG);
        return;
      }

      petToRename.name = newName;

      let balance = await Currency.getBalance(call.caller);

      try {
        if (balance < PET_RENAMING_PRICE) {
          this.send(messages.RENAME_BALANCE_CHANGED_DURING_RENAMING);
          return;
        }
        await petToRename.save();
      } catch {
        this.send(messages.SOMETHING_WENT_WRONG);
        return;
      }

      balance = await Currency.subtract(call.caller, PET_PRICE);

      this.send(messages.RENAME_SUCCESS.replace(/\{0\}/g, newName).replace(/\{1\}/g, balance));
      return;
    }

    if (args[0] && ['top', 'rank', 'ranking'].includes(args[0].toLowerCase())) {
      topPets(pets, message, args, call, messages);
      return;
    }

    // No pets
    if (pets.length === 0) {
      this.send(
        "You don't have a pet yet. Would you like to adopt one?",
        `Use **${this.client.options.prefix}pet adopt**`,
      );
      return;
    }

    // No args, show pets
    listPets(pets, message, args, call);
  },
});
