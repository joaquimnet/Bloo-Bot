const mongoose = require('mongoose');

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
    }
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
  }
});

profileSchema.methods.getVoteCountThisMonth = function getVoteCountThisMonth() {
  const currentDate = new Date();
  const currentMonthAndYear = `${currentDate.getMonth()}/${currentDate.getFullYear()}`;

  const userVotesThisMonth = this.votes.countPerMonth[currentMonthAndYear];

  return userVotesThisMonth || 0;
}

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
