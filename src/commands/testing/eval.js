const { Command } = require('chop-tools');

const Bloo = require('../../models/bloo');

module.exports = new Command({
  name: 'eval',
  description: 'eval stuff',
  category: 'testing',
  hidden: true,
  async run(message, args, call) {
    const handleError = err => this.send('Oopsie!\n' + err.message);

    // lets double check just to be sure, haha
    if (call.isSuperUser) {
      try {
        // eslint-disable-next-line no-eval
        const result = eval(call.content);
        let msg = 'Done.';
        if (result) {
          msg += 'Result: ```' + String(result) + '```';
        }
        message.channel.send(msg).catch(handleError);
      } catch (err) {
        handleError(err);
      }
    }
  },
});
