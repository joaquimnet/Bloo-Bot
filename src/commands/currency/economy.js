const { Command } = require('chop-tools');

const Profile = require('../../models/profile');
const { INK_EMOJI } = require('../../BLOO_GLOBALS');

const getEmoji = index => {
  return (
    {
      '0': ':first_place:',
      '1': ':second_place:',
      '2': ':third_place:',
    }['' + index] || ':small_blue_diamond:'
  );
};

const formatMoney = amount => (amount >= 1000 ? (amount / 1000).toFixed(1) + 'K' : amount);

module.exports = new Command({
  name: 'economy',
  description: 'Info about the Bloo economy, duh~',
  category: 'currency',
  aliases: ['eco'],
  async run() {
    const [{ money }] = await Profile.aggregate([
      { $group: { _id: '', money: { $sum: '$money' } } },
      { $project: { _id: 0, money: '$money' } },
    ]);

    const top5Profiles = await Profile.find({})
      .limit(10)
      .sort({ money: -1 })
      .exec();

    const blooProfile = await Profile.findOne({
      userId: '643338599281983501',
    }).exec();

    const blooMoney = blooProfile.money;

    const top5 = top5Profiles.map((profile, i) => {
      const user = this.client.users.get(profile.userId);
      const name = user ? user.username : profile.lastKnownName || 'Anonymous Bloo Baby';
      return `${getEmoji(i)}**${name}:** ${formatMoney(profile.money)}`;
    });

    const msg = [];

    msg.push(`__There is currently **${money}${INK_EMOJI}** in the economy.__`);
    top5.forEach(top5Person => msg.push(top5Person));
    msg.push(`:blue_heart: And I have **${blooMoney}${INK_EMOJI}** :smiling_face_with_3_hearts:`);

    this.send(...msg, { split: true });
  },
});
