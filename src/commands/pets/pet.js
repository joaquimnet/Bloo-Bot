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

module.exports = new Command({
  name: 'pet',
  description: Text.lines(
    'Trade your Bloo Ink for a pet that you can earn xp and feed!',
    'Use **pet adopt** to adopt one.',
    'Use **pet pat** to pat your pets.',
    'Use **pet rename** to rename your pets.',
    'Use **pet abandon** to get rid of a pet.',
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
        question: `Are you sure? That will cost you **${PET_PRICE}${INK_EMOJI}**`,
        userId: call.caller,
      });
      if (response !== true) {
        this.send('Okay then.');
        return;
      }

      // monie check
      if (call.profile.money < PET_PRICE) {
        this.send(`You don't have enough Bloo Ink${INK_EMOJI} to adopt a pet. :c`);
        return;
      }

      // pet count check
      if (pets.length >= MAX_PET_COUNT) {
        this.send("You can't adopt any more pets. :c");
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
        description: `Congratulations, ${message.author}!\nYou just adopted an adorable pet named **${petName}**.`,
        files: [{ name: 'pet.png', attachment: petImage }],
        thumbnail: { url: 'attachment://pet.png' },
        color: 0x009900,
      });
      this.send({ embed });
      return;
    }

    // Arg === abandon/yeet/delete
    if (args[0] && ['abandon', 'yeet', 'delete'].includes(args[0].toLowerCase())) {
      // abandon pet
      const whichPetToAbandonMessage = format(
        'Which pet would you like to throw away forever? **{0}**?',
        "I can't believe I have to be the bearer of bad news and tell them their master doesn't love them anymore.",
        "Please don't do this :frowning:",
      );
      const areYouSureMessage =
        "Are you sure you would like to do this? There isn't a possibility of getting the same pet back. And you may hurt their *feelings* :c \n**Please confirm that you would like to do this.**";
      const petAbandonedMessage =
        'You have gotten rid of your pet **{0}**. \n \nI bet you feel bad now.. *How could you?* :frowning:'; // << undefined
      const youHaveNoPetsMessage =
        "I hate to see this... You really don't like pets to the point... That you tried... To get rid.. Of a pet, that __***doesn't exist***__.";
      const userEnteredAPetNameThatTheyDontOwnMessage =
        "I do not see a pet under that name, maybe see if you are spelling it correctly? Or.... maybe you shouldn't get rid of your pet :smile: \nBut if you are serious about wanting to abandon your pet, please check your spelling and try again!";

      // 0 pets
      if (pets.length < 1) {
        this.send(youHaveNoPetsMessage);
        return;
      }

      let petToDelete = null;

      // more than 1 pet
      if (pets.length > 1) {
        const res = await Prompter.message({
          channel: message.channel,
          question: whichPetToAbandonMessage.replace(/\{0\}/g, pets.map(p => p.name).join(', ')),
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
          this.send(userEnteredAPetNameThatTheyDontOwnMessage);
          return;
        }
        // only 1 pet
      } else {
        petToDelete = pets[0];
      }

      const shouldDeletePet = await Prompter.confirm({
        channel: message.channel,
        question: areYouSureMessage,
        userId: call.caller,
      });
      if (shouldDeletePet !== true) {
        // ✅ ✖ -> user chose no.... KAFFE
        this.send('**Phew.** Thank goodness you decided not to! Thank you for having a heart.');
        return;
      }

      // eslint-disable-next-line
      await Pet.deleteOne({ _id: petToDelete._id }).exec();
      await Currency.add(call.caller, PET_ABANDON_RETURN_MONEY);
      this.send(petAbandonedMessage.replace(/\{0\}/g, petToDelete.name));
      return;
    }

    // Arg === pat 💕
    if (args[0] && ['pat', 'pet', 'loveon', 'givelove', 'p'].includes(args[0].toLowerCase())) {
      const petGotPatD = 'You have pat your pet **{0}** for **{1}** exp!';
      await this.send(`You can pat your pets every **${PET_PAT_COOLDOWN}** minutes.`);
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
              this.send(petGotPatD.replace(/\{0\}/g, pet.name).replace(/\{1\}/g, PET_PAT_EXP));
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
      // const characters = [14]ig
      const filter = new Filter();

      // 1. check pet count
      //    - if no pets, send message u got no pets u can adopt with blah blah....
      const youHaveNoPetsMessage = "You don't have a pet to rename.";

      if (pets.length < 1) {
        this.send(youHaveNoPetsMessage);
        return;
      }

      // 2. check money
      //    - if not enough, send message ur poor blah blah....
      const insufficientMoney =
        "Renaming costs {0}. You do not have enough funds to rename your pet. Please consider voting for me (**!b vote**) to gather more Blue Ink, or use **!b daily** if you haven't already!";
      if (call.profile.money < PET_RENAMING_PRICE) {
        this.send(insufficientMoney.replace(/\{0\}/g, PET_RENAMING_PRICE));
        return;
      }

      // 2.25?? - which pet lol?
      const whichPetToRename = 'Which pet would you like to rename? **{0}**?';

      // this message is not needed since we are bestMatching
      // const userEnteredAPetNameThatTheyDontOwnMessage =
      //   "I do not see a pet under that name, maybe check to see that you are spelling it correctly?";

      let petToRename = null;

      // more than 1 pet
      if (pets.length > 1) {
        while (!petToRename) {
          // eslint-disable-next-line no-await-in-loop
          const res = await Prompter.message({
            channel: message.channel,
            question: whichPetToRename.replace(/\{0\}/g, pets.map(p => p.name).join(', ')),
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
              const variableNamesLMAO = 'I do not see a pet under this name; did you mean **{0}**?';
              const { bestMatch } = match(
                chosenPetName,
                pets.map(p => p.name),
              );
              const bestMatchName = bestMatch.target;
              // eslint-disable-next-line no-await-in-loop
              const didWeGetIt = await Prompter.confirm({
                channel: message.channel,
                question: variableNamesLMAO.replace(/\{0\}/g, bestMatchName),
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

      // 2.5? prompt confirm
      //    - if no, send message okay then
      const areYouSure = 'Are you sure you would like to rename your pet? That will cost **{0}**.';
      const okayThen = 'Okie Dokie Artichokie.';
      // teehee okiedokieartichokie ~~~
      const response = await Prompter.confirm({
        channel: message.channel,
        question: areYouSure.replace(/\{0\}/g, PET_RENAMING_PRICE),
        userId: call.caller,
      });

      if (response !== true) {
        this.send(okayThen);
        return;
      }

      // 3. prompt for new name
      //    - prompt for a name, check for profanity
      //    - if profane, send message fk off dude blah blah....
      //    - we'll use filter.isProfane();
      const whatPetNewName = "What would you like your pet's new name to be?";
      const okayThenV2 = 'Alrighty then.';
      const nameIsProfane = `I'm going to need you to reconsider that name. That is an explicit name that I cannot allow you to name your pet that.`;
      const nameHasWeirdStuff = 'Only characters A-Z are allowed in your pets name.';
      const nameIsTooLong = `That name is too long. Pet names can only be ${PET_MAX_NAME_LENGTH} or less.`;
      const userMoneyChangedDuringRenamingCannotAffordAnymore =
        'You do not have enough Bloo ink to rename your pet.';
      const successPetRenamed = `Your pet is now named __**{0}**__ and you have **{1}** Bloo Ink.`;

      // ~~~oowoo~~~ 👍
      const responseList = await Prompter.message({
        channel: message.channel,
        question: whatPetNewName,
        userId: call.caller,
        deleteMessage: false,
      });

      const newName = responseList ? responseList.first().content.trim() : '';

      if (!newName) {
        this.send(okayThenV2);
        return;
      }

      if (filter.isProfane(newName)) {
        this.send(nameIsProfane);
        return;
      }

      if (/[^a-z ]/gi.test(newName)) {
        this.send(nameHasWeirdStuff);
        return;
      }

      if (newName > PET_MAX_NAME_LENGTH) {
        this.send(nameIsTooLong);
        return;
      }

      // 4. rename
      //    - change name
      petToRename.name = newName;

      // 4.5 - final money check
      let balance = await Currency.getBalance(call.caller);
      // steps:
      // 5. save
      //    - save to db
      try {
        if (balance < PET_RENAMING_PRICE) {
          this.send(userMoneyChangedDuringRenamingCannotAffordAnymore);
          return;
        }
        await petToRename.save();
      } catch {
        this.send('Something went wrong. :c');
        return;
      }

      // 5.5 take money from user
      balance = await Currency.subtract(call.caller, PET_PRICE);

      // 6. send feedback message
      //    - send message, success new pet name {petname}
      this.send(successPetRenamed.replace(/\{0\}/g, newName).replace(/\{1\}/g, balance));
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
    pets.forEach(pet => {
      const lastPatDate = pet.pats.time;
      this.send({
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
      });
    });
  },
});
