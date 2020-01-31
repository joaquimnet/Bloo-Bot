const { Command } = require('chop-tools');

module.exports = new Command({
  name: 'vote',
  description: 'Vote for bloo!',
  category: 'info',
  aliases: ['voting'],
  run(message, args, call) {
    const votesThisMonth = call.profile.getVoteCountThisMonth();
    const votesAllTime = call.profile.votes.count;

    this.send(
      "I'm so **happy** you want to vote for me! I promise I'll remember this~ 💙",
      '- You can vote for me every 12 hours. c:',
      '- During weekends voting gives you __double rewards__!',
      '- This month you have' +
        (votesThisMonth
          ? ` voted **${votesThisMonth}** time${votesThisMonth === 1 ? '' : 's'}.`
          : "n't voted yet this month."),
      '- You have' +
        (votesAllTime ? ` voted **${votesAllTime}** time${votesAllTime === 1 ? '' : 's'} overall :D` : ' never voted for me :c.'),
      'https://top.gg/bot/643338599281983501/vote',
    );
  },
});
