const { Listener } = require('chop-tools');

const MSG = 'If you are feeling suicidal and located in the United States, please call 1-800-273-8255, you can also text "HELP" to 741741.\nIf you are uncomfortable with either of these, please reach out to someone you trust and/or find a safe place.\nYou are worth more, you matter.\nNo matter how you are feeling, you are valid and strong.';

module.exports = new Listener({
  words: ['{me}', '(off|offing|kill|killing)', 'myself'],
  category: 'suicide',
  cooldown: 10,
  priority: 0,
  run(message) {
    message.channel.send(MSG);
    return true;
  },
});

// People's lives is all that matters to me. Which is why i made Bloo. 🔹💙
