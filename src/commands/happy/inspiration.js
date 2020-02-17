const { Command } = require('chop-tools');

const random = require('../../util/random');
const format = require('../../util/format');
const wait = require('../../util/wait');

const inspiration = [
  format('Your limitation—it’s only your imagination.'),
  format(
    'Push yourself, because no one else is going to do it for you.',
  ),
  format(
    'Sometimes later becomes never. Do it now.',
  ),
  format(
    'Great things never come from comfort zones.',
  ),
  format(
    'Dream it. Wish it. Do it.',
  ),
  format(
    'Success doesn’t just find you. You have to go out and get it.',
  ),
  format(
    'The harder you work for something, the greater you’ll feel when you achieve it.',
  ),
  format('Dream bigger. Do bigger.'),
  format(
    'Don’t stop when you’re tired. Stop when you’re done.',
  ),
  format(
    'Wake up with determination. Go to bed with satisfaction.',
  ),
  format(
    'Do something today that your future self will thank you for.',
  ),
  format('Little things make big days.'),
  format(
    'It’s going to be hard, but hard does not mean impossible.',
  ),
  format(
    'Don’t wait for opportunity. Create it.',
  ),
  format(
    'Sometimes we’re tested not to show our weaknesses, but to discover our strengths.',
  ),
  format(
    'The key to success is to focus on goals, not obstacles.',
  ),
  format(
    'Dream it. Believe it. Build it.',
  ),
  format(
    'Life is 10% what happens to us and 90% how we react to it.',
  ),
  format(
    'Be not afraid of life. Believe that life is worth living, and your belief will help create the fact.',
  ),
  format(
    'Even if you’re on the right track, you’ll get run over if you just sit there.',
  ),
  format(
    'Nurture your mind with great thoughts. To believe in the heroic makes heroes.',
  ),
  format(
    'You may find the worst enemy or best friend in yourself.',
  ),
  format(
    'The great thing in this world is not so much where you stand, as in what direction you are moving.',
  ),
];

module.exports = new Command({
  name: 'inspiration',
  description: 'Because we all need a little bit of inspiration from time to time.',
  category: 'happy',
  aliases: ['inspire'],
  usage: '[fast]',
  async run(message, args) {
    if (!(args && args[0] === 'fast')) {
      message.channel.startTyping().catch(() => {});
      await wait(2000);
    }
    this.send(random(inspiration))
      .then(() => message.channel.stopTyping())
      .catch(() => {});
  },
});

