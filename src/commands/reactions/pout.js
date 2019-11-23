const { Command } = require('chop-tools');

const makeEmbed = require('../../util/makeEmbed');
const random = require('../../util/random');
const findPerson = require('../../util/findPerson');

const images = [
  'https://imgur.com/a/YxAiVT1',
  'https://imgur.com/a/lfsh0P2',
  'https://imgur.com/a/duI69xE',
  'https://imgur.com/a/m0huRZe',
  'https://imgur.com/a/UBxfsJr',
  'https://imgur.com/a/oKJci6M',
  'https://imgur.com/a/VzJbSwX',
  'https://imgur.com/a/97iYVqb',
];

module.exports = new Command({
  name: 'pout',
  description: ':c',
  // args: ['target'],
  aliases: [],
  category: 'reactions',
  async run(message, args, call) {
    const target = await findPerson(message.mentions.members.first());

    let msg;
    if (target) {
      msg = `<@${call.caller}> is pouting at ${target.user}. Whatever you do.. :pleading_face: *don't* give in.`;
    } else {
      msg = `<@${call.caller}>'s pouting :pleading_face: `;
    }

    const embed = makeEmbed(
      msg,
      random(images),
      message,
    );

    message.channel.send({ embed });
  },
});
