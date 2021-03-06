const { Command, Text } = require('chop-tools');
const WordPOS = require('wordpos');

const words = new WordPOS();

module.exports = new Command({
  name: 'define',
  description: 'Shows information about a word.',
  category: 'other',
  aliases: ['word', 'dictionary'],
  async run(message, args) {
    const lookup = args[0] ? args[0].replace(/[^a-zA-Z ]/g, '').trim() : null;
    if (!lookup) {
      this.send(`Hey! You have to pass a valid word for me to look up.`);
      return;
    }

    const [result] = await words.lookup(lookup);
    const { def, gloss, synonyms } = result || {};

    if (!def || !synonyms || !gloss) {
      this.send("I couldn't find information about that word. :c");
      return;
    }

    const msg = [
      `**${lookup.toUpperCase()}**`,
      `**Definition: **${Text.capitalize(def)}.`,
      def === gloss ? undefined : `**Gloss: **${Text.capitalize(gloss)}.`,
      `**Synonyms: **${synonyms.join(', ')}.`,
    ].filter(v => !!v);

    this.send(...msg);
  },
});
