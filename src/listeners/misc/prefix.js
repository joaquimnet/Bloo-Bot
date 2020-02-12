const { Listener, Text } = require('chop-tools');

module.exports = new Listener({
  words: ['bloo', 'prefix'],
  category: 'bloo',
  cooldown: 900000,
  priority: 0,
  run(message) {
    const { prefix } = this.client.options;
    message.channel.send(
      Text.lines(
        `Do you want to know my prefix? My prefix is **${prefix}**.`,
        `To learn about my commands use **${prefix}help**.`,
      ),
    );
    return true;
  },
});
