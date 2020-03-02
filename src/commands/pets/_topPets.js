const { Pet, Profile } = require('../../models');
const format = require('../../util/format');

const getEmoji = index => {
  return (
    {
      '0': ':first_place:',
      '1': ':second_place:',
      '2': ':third_place:',
    }['' + index] || ':small_blue_diamond:'
  );
};

module.exports = async (pets, message, args, call, messages) => {
  const top5Pets = await Pet.find({})
  .limit(10)
  .sort({ level: -1 })
  .exec();

  top5Pets.sort((a, b) => {
    return a.level !== b.level ? b.level - a.level : b.experience - a.experience;
  });

  const top5 = [];

  for (const [i, pet] of top5Pets.entries()) {
    const user = message.client.users.get(pet.owner);
    let userName = user && user.username;
    if (!userName) {
      const profile = await Profile.findOne({ userId: pet.owner });
      userName = profile.lastKnownName || 'Anonymous Bloo Baby';
    }
    top5.push(`${getEmoji(i)}**${pet.name} (${userName}):** L:${pet.level} XP:${pet.experience}`);
  }

  const msg = [];
  msg.push(messages.TOP_HEADING);
  top5.forEach(top5Pet => msg.push(top5Pet));

  message.channel.send(format(...msg), { split: true });
  return;
};
