const { Command } = require('chop-tools');
const Prompter = require('chop-prompter');
const request = require('request-promise-native');

const listen = require('../../util/listen');

module.exports = new Command({
  name: 'joke',
  description: 'teehee~',
  category: 'funny',
  run(message) {
    Prompter.message({
      channel: message.channel,
      question: 'Do you want to hear a joke?',
      // prefix: 'I am',
      deleteMessage: false,
      userId: message.author.id,
    })
      .then(userResponse => {
        if (userResponse && listen(userResponse.first(), ['{yes}'])) {
          request('https://icanhazdadjoke.com/', {
            headers: {
              accept: 'application/json',
              'User-Agent': 'Bloo Bot (https://github.com/xbabyblu/Bloo-Bot)',
            },
          })
            .then(jokeResponse => {
              const { joke } = JSON.parse(jokeResponse);
              this.send({
                embed: {
                  title: joke,
                  description: ':rofl:',
                  thumbnail: {
                    url: this.client.user.avatarURL(),
                  },
                },
              }).catch(() => {});
            })
            .catch(() => {
              this.send({
                embed: {
                  title: 'Knock Knock. Who is there? Oh its me! Bloo, duh! ~ ',
                  description: ':rofl:',
                  thumbnail: {
                    url: this.client.user.avatarURL(),
                  },
                },
              }).catch(() => {});
            });
        } else {
          this.send('Okay then.');
        }
      })
      .catch(err => {
        this.client.logger.error(err);
        this.send('Okay then.');
      });
  },
});
