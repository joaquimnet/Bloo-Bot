const { Command } = require('chop-tools');
const moment = require('moment');

const Bloo = require('../../models/bloo');
const { promptDailyEncouragement } = require('../../services/encouragements');
const { INK_EMOJI } = require('../../util/constants');

const m = t => new moment(t || undefined).tz('America/New_York');

const timeUntilTomorrow = () =>
  m()
    .tz('America/New_York')
    .add(1, 'day')
    .startOf('day')
    .diff(m());

const timeToNextDaily = lastDaily => {
  const lastUsed = m(lastDaily);
  const now = m();
  if (lastUsed.isBefore(now, 'day')) {
    return 0;
  }
  return timeUntilTomorrow();
};

const formatTime = time => moment.duration(time).format('HH[H] mm[M] ss[S]');

module.exports = new Command({
  name: 'daily',
  description: 'Get your daily Blue Ink!',
  category: 'currency',
  aliases: ['day'],
  async run(message, args, call) {
    const next = timeToNextDaily(call.profile.daily.time);
    if (next <= 0) {
      const amount = Math.min(300 + call.profile.daily.count * 50, 2000);
      this.send(
        `:calendar_spiral: **| ${message.author.username}**! Here is your daily Bloo Ink! :D`,
        `:moneybag: **| ${amount}**${INK_EMOJI}`,
        `:newspaper: **|** By the way, you can **!b vote** for me to get even more Bloo Ink${INK_EMOJI} >u<`,
        `Your next daily is in **${formatTime(timeUntilTomorrow())}**`,
      );
      call.profile.daily.time = new Date();
      call.profile.daily.count += 1;
      call.profile.money += amount;
      await call.profile.save();
    } else {
      this.send(`:timer: **|** Oh no **${message.author.username}** you have to wait **${formatTime(next)}**`);
    }

    const dailyEncouragements = await promptDailyEncouragement(message.channel, message.author);
    if (dailyEncouragements) {
      this.send('Owo okay :blue_heart: I\'ll make sure to remember to send you an encouragement everyday.');
      // save settings to db
      call.profile.encouragementSettings.optedIn = true;
      call.profile.encouragementSettings.startDate = new Date();
      await call.profile.save();
      await Bloo.addUserToEncouragementList(call.caller);
    } else {
      this.send('Okay... :(');
      call.profile.encouragementSettings.optedIn = false;
      await call.profile.save();
      await Bloo.removeUserFromEncouragementList(call.caller);
    }
  },
});
