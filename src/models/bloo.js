const mongoose = require('mongoose');

const { isBeforeToday } = require('../services/time');

const { Schema } = mongoose;

const blooSchema = new Schema({
  logs: {
    channel: {
      type: String,
    },
    guild: {
      type: String,
    },
  },
  alerts: {
    channel: {
      type: String,
    },
    guild: {
      type: String,
    },
  },
  stats: {
    currentIdeaId: {
      type: Number,
      required: true,
      default: 0,
    },
    lastJackpot: {
      winner: {
        type: String,
        required: true,
        default: '',
      },
      time: { type: Date, default: new Date('1970-01-01'), required: true },
    },
  },
  loglevel: {
    type: String,
    required: true,
    default: 'info',
  },
  dailyEncouragementOptInList: {
    type: [String],
    required: true,
    default: [],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

blooSchema.pre('save', function preSave(next) {
  if (this.isModified('createdAt')) {
    throw new Error('Creation field is read only!');
  } else {
    next();
  }
});

blooSchema.pre('save', function preSave(next) {
  this.updatedAt = Date.now();
  next();
});

blooSchema.statics.getConfig = async function getConfig() {
  const config = await this.findOne({});
  if (!config) {
    throw new Error('Bloo config not found!');
  }
  return config;
};

blooSchema.statics.addUserToEncouragementList = async function addUserToEncouragementList(userId) {
  const config = await this.findOne({});
  const newList = [...config.dailyEncouragementOptInList, userId];
  config.dailyEncouragementOptInList = newList;
  await config.save();
  return userId;
};

blooSchema.statics.removeUserFromEncouragementList = async function removeUserFromEncouragementList(
  userId,
) {
  const config = await this.findOne({});
  const newList = config.dailyEncouragementOptInList.filter(u => u !== userId);
  config.dailyEncouragementOptInList = newList;
  await config.save();
  return userId;
};

blooSchema.statics.getEncouragementList = async function getEncouragementList() {
  const config = await this.findOne({});
  return config.dailyEncouragementOptInList;
};

blooSchema.statics.canGiveJackpotNow = async function canGiveJackpotNow() {
  const config = await this.findOne({});
  const lastJackpotDate = config.stats.lastJackpot.time;
  return isBeforeToday(lastJackpotDate);
};

blooSchema.statics.jackpotGiven = async function jackpotGiven(username) {
  const config = await this.findOne({});
  config.stats.lastJackpot.time = new Date();
  config.stats.lastJackpot.winner = username;
  await config.save();
  return username;
};

module.exports = mongoose.model('Bloo', blooSchema);
