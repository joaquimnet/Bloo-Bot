const { Listener } = require('chop-tools');

const sentiment = require('../../services/language/sentiment');
const send = require('../../services/safeSend');

// TODO:  if message is below 0 sentiment => cancel / abort message

module.exports = new Listener({
  words: ['{me}', 'happy'],
  category: 'emotions',
  cooldown: 120,
  priority: 0,
  run(message) {
    const prefix = this.client.options.prefix;
    const analysis = sentiment(message.content);
    if (analysis.positive.includes('pain') || analysis.positive.includes('die') || analysis.positive.includes('hurt')) {
      return false;
    }
    send(message)(
      'It makes me so happy to hear that you are happy. What things make you happy?',
      'I like the sunshine, the rain.',
      'I like roses, and lilies..',
      'Ooooh!',
      'And poems! Would you like to hear one?',
      'If so, say ' + prefix + 'poem !',
    )
    return true;
  },
});
// i tried to do something but sentiment just doesn't fucking work yet so i'll have to study it a bit. ;n;