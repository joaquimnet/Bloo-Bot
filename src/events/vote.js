const { Random, Text } = require('chop-tools');

const { Profile, Bloo, Logs } = require('../models');
const Currency = require('../services/currency');
const Alert = require('../services/alert');
const { INK_EMOJI, JACKPOT_AMOUNT } = require('../BLOO_GLOBALS');
const { faces, hearts } = require('../util/pretty');
const { VOTING_REWARD_NORMAL, VOTING_REWARD_WEEKEND } = require('../BLOO_GLOBALS');

module.exports = client => async vote => {
  client.logger.debug('[Event] New vote! ->', vote);

  let profile;
  try {
    profile = await Profile.getOrCreate(vote.user);
  } catch (err) {
    err.message += `\nCould not get profile for registering a vote for user ${vote.user}.`;
    client.emit('error', err);
    return;
  }

  const amount = vote.isWeekend ? VOTING_REWARD_WEEKEND : VOTING_REWARD_NORMAL;
  let newBalance;
  let isJackpot;
  try {
    isJackpot = await Bloo.shouldGiveJackpot();
    if (process.env.NODE_ENV === 'production') {
      newBalance = await Currency.add(vote.user, isJackpot ? amount + JACKPOT_AMOUNT : amount);
    } else {
      newBalance = profile.money;
    }
  } catch (err) {
    err.message += `\nCould not give voting currency to ${vote.user}.`;
    client.emit('error', err);
    return;
  }

  const currentDate = new Date();
  const currentMonthAndYear = `${currentDate.getMonth()}/${currentDate.getFullYear()}`;

  profile.votes.count += 1;
  profile.votes.time = currentDate;

  const userVotesThisMonth = profile.votes.countPerMonth[currentMonthAndYear] || 0;

  profile.votes.countPerMonth = {
    ...profile.votes.countPerMonth,
    [currentMonthAndYear]: userVotesThisMonth + 1,
  };

  try {
    if (process.env.NODE_ENV === 'production') {
      await profile.save();
    }
  } catch (err) {
    err.message += `\nCould not save profile for user ${vote.user} after voting.`;
    client.emit('error', err);
    return;
  }

  // Logging
  const user = client.users.get(profile.userId);
  const name = user ? user.tag : profile.lastKnownName || 'Some unknown Bloo baby';
  await Bloo.jackpotGiven(name);

  try {
    Alert.log(Alert.types.vote, client, `${name} just voted for us! Yeehaw!`, {
      thumbnail: user ? user.displayAvatarURL({ size: 512 }) : undefined,
    });
    if (isJackpot) {
      Alert.log(
        Alert.types.jackpot,
        client,
        `${name} hit the jackpot LOOOOOOOOOOOOOOOOOL! :sparkles:`,
        {
          thumbnail:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Star_icon_stylized.svg/512px-Star_icon_stylized.svg.png',
        },
      );
      await Logs.add('daily-jackpot', `${name} (${profile.userId}) won the daily jackpot!`);
    }
  } catch (err) {
    err.message += `\nFailed to send log message to bloo dev server... WTF?`;
    client.emit('error', err);
  }

  if (!user) return;

  let msg = [
    `Thank you so so much for voting for me! **${Random.pick(faces)}** ${Random.pick(hearts)}`,
    `You have now voted for me **${profile.votes.count}** times.`,
    `I'm giving you **${amount}${INK_EMOJI}** for this!`,
    `You now have **${newBalance}${INK_EMOJI}**.`,
  ];

  if (isJackpot) {
    msg = [
      ...msg,
      ' ',
      ':sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: ',
      `***OMG OMG OMG CONGRATULATIONS ${user.username}!!!***`,
      "You won today's daily jackpot! 💰 💎",
      `Besides the regular amount you'll receive an extra **${JACKPOT_AMOUNT}**${INK_EMOJI}.`,
      'That was very cash money of you. :sunglasses: ',
      ':sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: :sparkles: ',
    ];
  }

  user
    .send(Text.lines(...msg))
    // Could not dm user. Sad but ok.
    .catch(() => {});
};
