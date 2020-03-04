const makeEmbed = require('../../util/makeEmbed');
const findPerson = require('../../util/findPerson');
const Gifs = require('../../services/gifs');

module.exports = options => {
  return async function(message, args, call) {
    const target = await findPerson(message.mentions.members.first());

    const msgTarget =
      options.msgTarget &&
      options.msgTarget.replace(/%user/gi, `<@${call.caller}>`).replace(/%target/gi, target);
    const msgNoTarget =
      options.msgNoTarget && options.msgNoTarget.replace(/%user/gi, `<@${call.caller}>`);

    const msg = target ? msgTarget : msgNoTarget;

    if (!msg) return;

    const embed = makeEmbed(msg, await Gifs.random(options.gif), message);

    this.send({ embed });
  };
};
