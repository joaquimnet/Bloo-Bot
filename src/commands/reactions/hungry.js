const { Command } = require('chop-tools');

const makeEmbed = require('../../util/makeEmbed');
const findPerson = require('../../util/findPerson');
const Gifs = require('../../services/gifs');

module.exports = new Command({
  name: 'hungry',
  description: "we all get a little hungry sometimes",
  aliases: ['starving', 'famished'],
  category: 'reactions',
  usage: '[target]',
  examples: [' ', '@Lar#9547', '@Xlilblu#5239'],
  hidden: true,
  async run(message, args, call) {
    const target = await findPerson(message.mentions.members.first());

    let msg;
    if (target) {
      msg = `<@${call.caller}> wants to tell ${target} that they are very hungry. I suggest you feed them.`;
    } else {
      msg = `<@${call.caller}> is saying that they're hungry! :fork_knife_plate: `;
    }

    const embed = makeEmbed(msg, await Gifs.random('hungry'), message);

    this.send({ embed });
  },
});