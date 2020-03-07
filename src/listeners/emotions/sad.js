const { Listener } = require('chop-tools');
const Prompter = require('chop-prompter');

const send = require('../../services/safeSend');

module.exports = new Listener({
  words: ['{me}', '({be}|im)', 'sad'],
  category: 'emotions',
  cooldown: 10,
  priority: 0,
  run(message) {
    Prompter.message({
      channel: message.channel,
      question:
        'What is going on? Maybe a nice cup of hot tea or coffee could help stabilize your mood.',
      userId: message.author.id,
      max: 1,
      timeout: 90000,
    }).then(responses => {
      // If no responses, the time ran out
      if (!responses) {
        send(message)("I'm still here if you'd like to talk.");
        return;
      }

      const response = responses.first();

      // Proper response to sadness:
      // Empathetic response formula => Good Feeling Words, Tentafier, & Situation
      // i.e: "i am sad that my parents are going through a divorce", proper response would be
      // "I understand that you are feeling SAD that you are going through such.
      // You are strong for talking about it"
      // so how can we make a robot do a simpler version of such?
      // "You're upset because (x) right? I'm sorry you are going through this.
      // Everything is going to work out in the end, we go through things for a reason.
      // Without the bad, we wouldn't know how to appreciate the good."

      // Respond
      send(message)(
        `I am sorry you are going through this. But without the bad things in life, we would not know how to enjoy the good things. That's the beauty in life.`,
      );
    });
    return true;
  },
});
