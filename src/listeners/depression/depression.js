const { Listener, stringMatch, COMMON_EXPRESSIONS } = require('chop-tools');
const Prompter = require('chop-prompter');

const wait = require('../../util/wait');
const send = require('../../services/safeSend');

module.exports = new Listener({
  words: ['{me}','(got|have)', 'depression'], // -> -> -> 👌
  category: 'depression',
  cooldown: 15,
  priority: 0,
  async run(message) {
    // ask
    const name = message.member.nickname || message.author.username;
    const userResponse = await Prompter.message({
      channel: message.channel,
      question: `I'm getting that you are have depression __${name}__, is this a correct statement to make?`,
      deleteMessage: false,
      userId: message.author.id,
    });

    if (!userResponse) {
      return true;
    }

    // if not yes
    if(!stringMatch(userResponse.first(), [COMMON_EXPRESSIONS.yes])) {
      send(message)('Well, I am glad to hear that you don\'t have depression, it\'s a pretty sucky thing to have. :(');
      return true;
    }
    
    // respond
    message.channel.startTyping().catch(() => {});
    await wait(2000);

    send(message)(
      "Do you have a support group? Maybe friends or family? They can be a great help in times like these.",
      '*Humans are not meant to go through such hard things alone.*',
      'I know that you may or may not have isolated yourself from these people, and it can seem challenging to reach back out to them.',
      'But I promise that they will still be there for you. Reach out to a good friend or family member and hang out with them.',
      'Talking to them, if you trust them, is a great alternative to coping with your emotions.',
      'Some other good coping mechanisms can include: listening to music(your favorite, of course), writing, drawing, going for a walk, playing video games, or even a good nap.',
      'Anything you enjoy can help relieve such.',
      'Even when you feel apathetic or anhedonic, I promise that trying to do such will trigger the serotonin in your brain, and make you feel relieved/happier.',
    )
      .then(() => message.channel.stopTyping())
      .catch(() => {});
    return true;
  },
});

// People's lives is all that matters to me. Which is why i made Bloo. 🔹💙
