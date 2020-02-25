const { Command } = require('chop-tools');

module.exports = new Command({
  name: 'invite',
  description: 'Generates an invite for Bloo.',
  aliases: ['inviteme'],
  category: 'other',
  // args: [''],
  // delete: true,
  hidden: false,
  async run() {
    const invite = 'https://discordapp.com/api/oauth2/authorize?client_id=643338599281983501&permissions=392256&scope=bot'
    this.send('I\'m so happy you want to invite me c:' , invite);
  },
});
