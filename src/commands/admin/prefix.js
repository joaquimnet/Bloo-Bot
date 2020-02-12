const { Command } = require('chop-tools');
const Prompter = require('chop-prompter');

module.exports = new Command({
  name: 'prefix',
  description: "Change Bloo's prefix on your server.",
  category: 'admin',
  admin: true,
  async run(message, args, call) {
    const hasCustomPrefix = !!call.settings.prefixSettings.prefix;
    const defaultPrefix = this.client.options.prefix;
    if (!args[0]) {
      if (hasCustomPrefix) {
        this.send(`My prefix on this server is **${call.settings.prefixSettings.prefix}**`);
      } else {
        this.send(`My prefix on this server is the default one **${defaultPrefix}**.`);
      }
      return;
    }

    let newPrefix = args[0]
      .trim()
      .toLowerCase()
      .replace(/\s\s+/g, '');

    const isValidPrefix = newPrefix.length > 0;

    if (!isValidPrefix) {
      this.send('That is not a valid prefix!');
      return;
    }

    if (['!b', 'remove', 'delete'].includes(newPrefix)) {
      call.settings.prefixSettings = undefined;

      await call.settings.save();

      this.client.prefixes.unloadOne(call.settings.guildId);

      this.send(`Removed! My prefix on this server is back to the default **${defaultPrefix}**`);
      return;
    }

    const includeDanglingSpace = await Prompter.confirm({
      channel: message.channel,
      question: `Would you like to add a space to the end of **${newPrefix}**?\nWith space: __${newPrefix} help__\nWithout space: __${newPrefix}help__`,
      userId: call.caller,
    });

    if (includeDanglingSpace) {
      newPrefix += ' ';
    }

    call.settings.prefixSettings.prefix = newPrefix;
    call.settings.prefixSettings.updatedAt = new Date();

    await call.settings.save();

    this.client.prefixes.loadOne(call.settings.guildId, newPrefix);

    this.send(`Done! My prefix on this server is now **${newPrefix}**`);
  },
});
