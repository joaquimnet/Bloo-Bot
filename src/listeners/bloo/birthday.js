const { Listener } = require('chop-tools');

module.exports = new Listener({
  words: ['(how|what|when)', '{be}', 'your', '(birthday|bday|cake day)', 'bloo'],
  category: 'bloo',
  cooldown: 10,
  priority: 0,
  run(message) {
    message.channel.send(
      '**My birthday is** November, 19. **My birth year is** 2019. I am curious why you are asking, though. Are you getting me a present for my birthday?? o3o',
    );
    return true;
  },
});
