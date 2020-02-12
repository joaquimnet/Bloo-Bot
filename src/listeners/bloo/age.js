const { Listener, Text } = require('chop-tools');

const { BLOO_EPOCH } = require('../../BLOO_GLOBALS');

module.exports = new Listener({
  words: ['(how|what)', '(old|age)', '{be}', 'bloo'],
  category: 'bloo',
  cooldown: 10,
  priority: 0,
  run(message) {
    const age = (''+(Date.now() - BLOO_EPOCH)).replace(/\d\d\d$/, '000');
    message.channel.send(Text.duration(`I was born exactly **{duration:${age}}** ago. :)`));
    return true;
  },
});
