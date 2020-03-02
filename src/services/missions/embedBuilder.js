const path = require('path');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const { Text } = require('chop-tools');

const makeEmbed = require('../../util/makeEmbed');
const flatSeconds = require('../../util/flatSeconds');
const xp = require('../../util/magicformula');
const { clock, diff } = require('../time');

const addBaseFields = (mission, embed) => {
  embed.setTitle(mission.display());
  embed.addField('Money Reward', mission.money, true);
  embed.addField('Pet Exp Reward', mission.petExp, true);
  embed.addField('Duration', mission.duration, true);
};

module.exports = class EmbedBuilder {
  static missionAskToStart(mission, message) {
    const embed = makeEmbed(
      '',
      path.join(__dirname, '../../../assets/mission_start.png'),
      message,
      true,
    );

    addBaseFields(mission, embed);

    return embed;
  }

  static missionInProgress(mission, message) {
    const embed = makeEmbed('', undefined, message);

    addBaseFields(mission, embed);

    const end = moment(mission.createdAt)
      .add(mission.duration, 'minutes')
      .toDate();

    embed.addField('Time Remaining', clock(diff(Date.now(), end)));

    return embed;
  }

  static missionCompleted(mission, message) {
    const embed = makeEmbed(
      '',
      path.join(__dirname, '../../../assets/mission_completed.png'),
      message,
      true,
    );

    addBaseFields(mission, embed);

    embed.setThumbnail(
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Star_icon_stylized.svg/512px-Star_icon_stylized.svg.png',
    );

    return embed;
  }

  static petDisplay(pet) {
    return new MessageEmbed({
      title: pet.name,
      description: Text.lines(
        `⭐ **Level:** __${pet.level}__`,
        `✨ **Experience:** __${pet.experience}/${xp.expToNextLevel(pet.level)}__`,
        `💕 **Pats:** __${pet.pats.count}__`,
        Text.duration(
          `**Last pat:** __{duration:${flatSeconds(Date.now() - pet.pats.time.getTime())}}__ ago.`,
        ),
      ),
      files: [{ name: 'pet.png', attachment: pet.image }],
      thumbnail: { url: 'attachment://pet.png' },
      // eslint-disable-next-line no-underscore-dangle
      footer: { text: pet._id, iconURL: 'attachment://pet.png' },
    });
  }
};
