const makeEmbed = require('../../util/makeEmbed');
const findPerson = require('../../util/findPerson');
const Gifs = require('../../services/gifs');

module.exports = options => {
  return async function(message, args, call) {
    const target = await findPerson(message.mentions.members.first());

    const msg = (options.msgTarget || options.msg || options.msgNoTarget)
      .replace(/%user/gi, `${call.callerTag}`)
      .replace(/%target/gi, target);

    const embed = makeEmbed(msg, await Gifs.random(options.gif), message);

    target.send({ embed });
  };
};
