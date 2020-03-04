const mongoose = require('mongoose');

const Bloo = require('./bloo');

const Schema = mongoose.Schema;

const profileSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  candy: {
    count: { type: Number, default: 0 },
    time: { type: Date, default: new Date('1970-01-01') },
  },
  daily: {
    count: { type: Number, default: 0 },
    time: { type: Date, default: new Date('1970-01-01') },
  },
  votes: {
    count: { type: Number, default: 0 },
    countPerMonth: {
      type: Object,
      default: {},
    },
    time: { type: Date, default: new Date('1970-01-01') },
  },
  encouragementSettings: {
    optedIn: {
      type: Boolean,
    },
    startDate: {
      type: Date,
      default: new Date(),
    },
  },
  money: {
    type: Number,
    default: 0,
  },
  brb: {
    type: String,
  },
  lastKnownName: {
    type: String,
  },
});

profileSchema.methods.getVoteCountThisMonth = function getVoteCountThisMonth() {
  const currentDate = new Date();
  const currentMonthAndYear = `${currentDate.getMonth()}/${currentDate.getFullYear()}`;

  const userVotesThisMonth = this.votes.countPerMonth[currentMonthAndYear];

  return userVotesThisMonth || 0;
};

profileSchema.methods.canVoteNow = function canVoteNow() {
  const timeDifference = Date.now() - this.votes.time.getTime();
  const time12hours = 12 * 60 * 60 * 1000;
  return timeDifference > time12hours;
};

profileSchema.methods.encouragementsOptIn = async function encouragementsOptIn() {
  this.encouragementSettings.optedIn = true;
  this.encouragementSettings.startDate = new Date();
  await this.save();
  await Bloo.addUserToEncouragementList(this.userId);
  return this;
};

profileSchema.methods.encouragementsOptOut = async function encouragementsOptOut() {
  this.encouragementSettings.optedIn = false;
  await this.save();
  await Bloo.removeUserFromEncouragementList(this.userId);
  return this;
};

profileSchema.methods.hasAnsweredDailyEncouragementPrompt = function hasAnsweredDailyEncouragementPrompt() {
  return (
    this.encouragementSettings &&
    (this.encouragementSettings.optedIn === true || this.encouragementSettings.optedIn === false)
  );
};

profileSchema.statics.getOrCreate = async function getOrCreate(userId) {
  let profile;
  try {
    profile = await this.findOne({ userId });
    if (profile) {
      return profile;
    }
    // eslint-disable-next-line new-cap
    profile = new mongoose.model('Profile')({ userId });
    await profile.save();
    return profile;
  } catch (err) {
    err.stack = `[Profile/getProfile] Could not get profile for id: ${userId}\n` + err.stack;
    throw err;
  }
};

module.exports = mongoose.model('Profile', profileSchema);
