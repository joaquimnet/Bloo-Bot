const { Command } = require('chop-tools');

const makeEmbed = require('../../util/makeEmbed');
const random = require('../../util/random');
const findPerson = require('../../util/findPerson');

const images = [];

for (let i = 0; i <= 7; i++) {
  images.push(`http://cdn.chop.coffee/pout/${i}.gif`);
}

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
