
const { Command } = require('chop-tools');

const makeEmbed = require('../../util/makeEmbed');
const findPerson = require('../../util/findPerson');
const Gifs = require('../../services/gifs');

module.exports = new Command({
  name: 'angry',
  description: "show that you're angry >:(",
  aliases: ['angery', 'irate', 'mad', 'upset', 'irritated'],
  category: 'reactions',
  usage: '[target]',
  hidden: true,
  examples: [' ', '@Lar#9547', '@Xlilblu#5239'],
  async run(message, args, call) {
    const target = await findPerson(message.mentions.members.first());

    let msg;
    if (target) {
      msg = `Beware ${target}. <@${call.caller}> is very angry at you.`;
    } else {
      msg = `**Caution**<@${call.caller}> seems to be really angry.`;
    }

    const embed = makeEmbed(msg, await Gifs.random('angry'), message);

    this.send({ embed });
  },
});
