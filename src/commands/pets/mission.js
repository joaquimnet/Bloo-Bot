const { Command, Text } = require('chop-tools');
const Prompter = require('chop-prompter');

const Profile = require('../../models/profile');
const Pet = require('../../models/pet');
const Pets = require('../../services/pets');
const Mission = require('../../models/missions');
const argMatches = require('../../util/argMatches');
const Currency = require('../../services/currency');

const { generateMission, EmbedBuilder } = require('../../services/missions');
const { MISSIONS } = require('../../BLOO_GLOBALS');

module.exports = new Command({
  name: 'mission',
  description: 'Complete missions for Bloo Ink and Pet experience!',
  category: 'pets',
  aliases: ['mission', 'quest'],
  examples: [' ', 'start'],
  async run(message, args, call) {
    const currentMission = await Mission.findOne({ userId: call.caller });

    const DEV_SERVER = this.client.guilds.get('645644813533839398');

    // has a mission and its completed
    if (currentMission && currentMission.hasCompleted()) {
      this.send({ embed: EmbedBuilder.missionCompleted(currentMission, message) });
      const { money, petExp } = currentMission;
      await Currency.add(call.caller, money);
      const pets = await Pet.find({ owner: call.caller }).exec();
      for (const pet of pets) {
        const gainedLevels = await pet.giveExp(petExp);
        if (gainedLevels) {
          Pets.buildLevelUpImage(pet.image).then(img => {
            message.channel.send({ files: [img] });
          });
        }
      }
      // eslint-disable-next-line no-underscore-dangle
      await Mission.deleteOne({ _id: currentMission._id });
      return;
    }

    // does not have a mission and wants to start one
    if (!currentMission && argMatches(0, ['start', 'go'], args)) {
      const options = [
        generateMission(Mission.DIFFICULTIES.get(MISSIONS.EASY.NAME)),
        generateMission(Mission.DIFFICULTIES.get(MISSIONS.NORMAL.NAME)),
        generateMission(Mission.DIFFICULTIES.get(MISSIONS.HARD.NAME)),
        // generateMission(Mission.DIFFICULTIES.get(MISSIONS.INSANE.NAME)),
        // generateMission(Mission.DIFFICULTIES.get(MISSIONS.MASTER.NAME)),
      ];

      const response = await Prompter.choice({
        channel: message.channel,
        question: Text.lines('**Pick a mission to start**', ...options.map(m => m.display())),
        userId: call.caller,
        choices: options.map(m => DEV_SERVER.emojis.get(m.emojiId)),
      });

      if (!response) return;

      const generatedMission = options.find(
        m => m.emojiId === response.id || m.emojiId === response,
      );

      const shouldStartMission = await Prompter.confirm({
        channel: message.channel,
        question: `${generatedMission.displayLong()}\n__Do you wish to start this mission?__`,
        userId: call.caller,
      });

      const embed = EmbedBuilder.missionAskToStart(generatedMission, message);

      if (shouldStartMission) {
        await Mission.startMission({
          userId: call.caller,
          mission: generatedMission,
        });
        this.send({ embed });
      }
      return;
    }

    // no arguments
    if (currentMission) {
      this.send({ embed: EmbedBuilder.missionInProgress(currentMission, message) });
    } else {
      this.send("You aren't in a mission at the moment. Use **!b mission start** to start one.");
    }
  },
});
