const { Command } = require('chop-tools');

const emoji = '<:right:652702479292825600> ';

module.exports = new Command({
  name: 'listeners',
  description: 'Shows the loaded listeners.',
  category: 'testing',
  aliases: ['list'],
  // delete: true,
  hidden: true,
  async run() {
    const list = [...this.client.listeners.values()].map(l => emoji + l.toString());
    // console.log(list);
    await this.send('These are the loaded listeners.');
    this.send(...list, { split: true });
  },
});
