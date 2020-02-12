const { Random } = require('chop-tools');

const Profile = require('../models/profile');
const Currency = require('../services/currency');
const Alert = require('../services/alert');
const { INK_EMOJI } = require('../util/constants');
const format = require('../util/format');
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
  try {
    if (process.env.NODE_ENV === 'production') {
      newBalance = await Currency.add(vote.user, amount);
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

  // TODO: Also check profiles on database
  const user = client.users.get(vote.user);

  if (!user) {
    try {
      Alert.log(
        Alert.types.vote,
        client,
        `Someone Bloo doesn't share a server with just voted for her! Yeehaw!`,
      );
    } catch (err) {
      err.message += `\nFailed to send log message to bloo dev server... WTF?`;
      client.emit('error', err);
    }
    return;
  }

  try {
    Alert.log(Alert.types.vote, client, `${user.tag} just voted for us! Yeehaw!`, {
      thumbnail: user.displayAvatarURL({ size: 512 }),
    });
  } catch (err) {
    err.message += `\nFailed to send log message to bloo dev server... WTF?`;
    client.emit('error', err);
  }

  const faces = [
    '(✿◠‿◠)',
    '≧◡≦',
    '(●´ω｀●)',
    '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧',
    '(づ｡◕‿‿◕｡)づ',
    '(•⊙ω⊙•)',
    '(∪ ◡ ∪)',
    '◕ ◡ ◕',
    'ヽ(゜∇゜)ノ',
    '(⌒o⌒)',
    '(◡‿◡✿)',
    '(✿ ♥‿♥)',
    '★~(◡﹏◕✿)',
    '(╯3╰)',
    'ｖ(⌒ｏ⌒)ｖ♪',
    '＼(^。^ )',
    'ﾍ(￣▽￣*)ﾉ',
    '＼(^ω^＼)',
  ];

  const hearts = [
    '❤️',
    '🧡',
    '💛',
    '💚',
    '💙',
    '💜',
    '🤎',
    '🤍',
    '💕',
    '💞',
    '💓',
    '💗',
    '💖',
    '💘',
    '💝',
    '💟',
    '🥰',
  ];

  user
    .send(
      format(
        `Thank you so so much for voting for me! **${Random.pick(faces)}** ${Random.pick(hearts)}`,
        `You have now voted for me **${profile.votes.count}** times.`,
        `I'm giving you **${amount}${INK_EMOJI}** for this!`,
        `You now have **${newBalance}${INK_EMOJI}**.`,
      ),
    )
    // Could not dm user. Sad but ok.
    .catch(() => {});
};
