const mongoose = require('mongoose');
const moment = require('moment');
const { Text } = require('chop-tools');

const Mission = require('../services/missions/mission');
const { difficulties } = require('../services/missions');

const { Schema } = mongoose;

const missionSchema = new Schema({
  userId: {
    type: String,
    minlength: 3,
    required: true,
  },
  mission: {
    type: String,
    minlength: 3,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  money: {
    type: Number,
    required: true,
  },
  petExp: {
    type: Number,
    required: true,
  },
  emoji: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

missionSchema.pre('save', function preSave(next) {
  if (this.isModified('createdAt')) {
    throw new Error('Creation field is read only!');
  }
  this.updatedAt = Date.now();
  next();
});

missionSchema.statics.startMission = async function startMission({ userId, mission }) {
  if (!userId || !mission) {
    throw new TypeError('To create a mission please specify userId, mission and duration.');
  }
  if (!(mission instanceof Mission)) {
    throw new TypeError('The mission argument must be an instance of Mission.');
  }
  // eslint-disable-next-line new-cap
  const missionDocument = new mongoose.model('Mission')({ userId, ...mission });
  await missionDocument.save();
  return missionDocument;
};

missionSchema.statics.DIFFICULTIES = difficulties;

missionSchema.methods.hasCompleted = function hasCompleted() {
  const completionDate = moment(this.createdAt);
  completionDate.add(this.duration, 'minutes');
  return moment().isAfter(completionDate);
};

missionSchema.methods.getCompletionDate = function getCompletionDate() {
  const completionDate = moment(this.createdAt);
  completionDate.add(this.duration, 'minutes');
  return completionDate;
};

missionSchema.methods.display = function display() {
  return `${this.emoji} **[${this.difficulty}]** ${this.mission} - __${this.duration}m__`;
};

missionSchema.methods.displayLong = function displayLong() {
  return Text.lines(
    `${this.emoji} **${this.mission}**`,
    `**Difficulty:** ${this.difficulty}`,
    `**Duration:** ${this.duration} minutes.`,
    `**Bloo Ink Reward:** ${this.money}`,
    `**Pet Exp Reward:** ${this.petExp}`,
  );
};

module.exports = mongoose.model('Mission', missionSchema);
