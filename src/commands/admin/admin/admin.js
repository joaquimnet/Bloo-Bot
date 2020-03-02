const { Command } = require('chop-tools');

const argMatches = require('../../../util/argMatches');

const petAdmin = require('./_petAdmin');

module.exports = new Command({
  name: 'admin',
  description: "Blu and Kaffe's command for maintaining Bloo.",
  category: 'admin',
  hidden: true,
  run(message, args, call) {
    if (argMatches(0, ['pet', 'pets', 'p'], args)) {
      try {
        petAdmin(args[1].toLowerCase(), {
          target: args[2],
          field: args[3],
          value: args[4],
        });
        this.send('Done!');
      } catch (err) {
        this.send('Could not complete command. An error ocurred.');
        this.client.emit('error', err);
      }
      return;
    }

    this.send(
      '**Valid Subcommands**',
      '**Pet**: (set/add/decrease) (target) (field) (value)',
      'Ex: !b admin pet add pet:5df919d4e7356f0017f5b7a4 experience 1',
    );
  },
});
