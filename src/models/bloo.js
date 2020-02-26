const mongoose = require('mongoose');

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
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now(),
  }
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

blooSchema.statics.addUserToEncouragementList = async function addUserToEncouragementList(userId) {
  const config = await this.findOne({});
  const newList = [...config.dailyEncouragementOptInList, userId];
  config.dailyEncouragementOptInList = newList;
  await config.save();
  return userId;
}

blooSchema.statics.removeUserFromEncouragementList = async function removeUserFromEncouragementList(userId) {
  const config = await this.findOne({});
  const newList = config.dailyEncouragementOptInList.filter(u => u !== userId);
  config.dailyEncouragementOptInList = newList;
  await config.save();
  return userId;
}

blooSchema.statics.getEncouragementList = async function getEncouragementList() {
  const config = await this.findOne({});
  return config.dailyEncouragementOptInList;
}

module.exports = mongoose.model('Bloo', blooSchema);
