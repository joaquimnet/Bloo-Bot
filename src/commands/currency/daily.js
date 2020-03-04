const { Command } = require('chop-tools');
const moment = require('moment');

const { Bloo, Logs } = require('../../models');
const { promptDailyEncouragement } = require('../../services/encouragements');
const Alert = require('../../services/alert');
const { INK_EMOJI, JACKPOT_AMOUNT } = require('../../BLOO_GLOBALS');

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
    if (next > 0) {
      this.send(
        `:timer: **|** Oh no **${message.author.username}** you have to wait **${formatTime(
          next,
        )}**`,
      );
      return;
    }
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

    if (await Bloo.shouldGiveJackpot()) {
      this.client.logger.info(`[Daily Jackpot] ${call.callerTag} won the jackpot!!!`);
      // Log to database
      await Logs.add(
        'daily-jackpot',
        `${call.callerUsername} (${call.caller}) won the daily jackpot!`,
      );
      this.send(
        ':sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: ',
        `***CONGRATULATIONS ${call.callerUsername}!!!***`,
        "You won today's daily jackpot! 💰 💎",
        `Besides the regular amount you'll receive an extra **${JACKPOT_AMOUNT}**${INK_EMOJI}.`,
        'That was very cash money of you. :sunglasses: ',
        ':sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: ',
      );
      call.profile.money += JACKPOT_AMOUNT;
      await call.profile.save();
      await Bloo.jackpotGiven(call.callerUsername);

      Alert.log(
        Alert.types.jackpot,
        this.client,
        `${call.callerTag} hit the jackpot LOOOOOOOOOOOOOOOOOL! :sparkles:`,
        {
          thumbnail:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Star_icon_stylized.svg/512px-Star_icon_stylized.svg.png',
        },
      );
    }

    // Shouldn't prompt more than once
    if (call.profile.hasAnsweredDailyEncouragementPrompt()) {
      return;
    }

    const dailyEncouragements = await promptDailyEncouragement(message.channel, message.author);
    if (dailyEncouragements) {
      await call.profile.encouragementsOptIn();
      this.send(
        "Owo okay :blue_heart: I'll make sure to remember to send you an encouragement everyday.",
      );
    } else {
      await call.profile.encouragementsOptOut();
      this.send('Okay... :(');
    }
  },
});
