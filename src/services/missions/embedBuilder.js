const path = require('path');
const moment = require('moment');

const makeEmbed = require('../../util/makeEmbed');
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
};
