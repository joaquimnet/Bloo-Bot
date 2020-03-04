const { Listener } = require('chop-tools');

const wait = require('../../util/wait');
const send = require('../../services/safeSend');

module.exports = new Listener({
  words: ['{me}', '({be}|im)', 'happy'],
  category: 'emotions',
  cooldown: 10,
  priority: 0,
  async run(message) {
    const prefix = this.client.options.prefix;

    // Is the person *really* happy?
    if (/(not|aint|ain't)\s+(happy|hapy)/.test(message.content.toLowerCase())) {
      return false;
    }

    message.channel.startTyping().catch(() => {});
    await wait(3000);
    send(message)(
      'It makes me so happy to hear that you are happy. What things make you happy?',
      'I like the sunshine, the rain.',
      'I like roses, and lilies..',
      'Ooooh!',
      'And poems! Would you like to hear one?',
      'If so, say ' + prefix + 'poem !',
    )
      .then(() => message.channel.stopTyping())
      .catch(() => {});
    return true;
  },
});
