const Pet = require('../../models/pet');
const format = require('../../util/format');

module.exports = async (pets, message, args, call, messages) => {
  const top5Pets = await Pet.find({})
        .limit(5)
        .sort({ level: -1 })
        .exec();

      top5Pets.sort((a, b) => {
        return a.level === b.level ? b.experience - a.experience : b.level - a.level;
      });

      const top5 = top5Pets.map((p, i) => {
        const medals = {
          '0': ':first_place:',
          '1': ':second_place:',
          '2': ':third_place:',
          '3': ':small_blue_diamond:',
          '4': ':small_blue_diamond:',
        };
        // if cant find user they don't share a server with bloo.
        // TODO: Check profiles database for this user.
        const u = message.client.users.get(p.owner);
        return `${medals['' + i]}**${p.name} (${u ? u.tag : 'Anonymous Bloo Baby'}):** L:${
          p.level
        } XP:${p.experience}`;
      });

      const msg = [];
      msg.push(messages.TOP_HEADING);
      top5.forEach(top5Pet => msg.push(top5Pet));

      message.channel.send(format(...msg), { split: true });
      return;
};
