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

const petAdopt = require('./_petAdopt');
const petAbandon = require('./_petAbandon');
const petPat = require('./_petPat');
const renamePet = require('./_renamePet');
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
      petAdopt(pets, message, args, call, messages);
      return;
    }

    // Arg === abandon/yeet/delete
    if (args[0] && ['abandon', 'yeet', 'delete'].includes(args[0].toLowerCase())) {
      petAbandon(pets, message, args, call, messages);
      return;
    }

    // Arg === pat 💕
    if (args[0] && ['pat', 'pet', 'loveon', 'givelove', 'p'].includes(args[0].toLowerCase())) {
      petPat(pets, message, args, call, messages);
      return;
    }

    // arg === rename
    if (
      args[0] &&
      ['rename', 'changename', 'idk', 'helpmebluLOL', 'r'].includes(args[0].toLowerCase())
    ) {
      renamePet(pets, message, args, call, messages);
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
