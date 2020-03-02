const mongoose = require('mongoose');

const { Schema } = mongoose;

const logSchema = new Schema({
  eventType: {
    type: String,
    minlength: 3,
    required: true,
  },
  info: {
    type: String,
    minlength: 3,
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

logSchema.pre('save', function preSave(next) {
  if (this.isModified('createdAt')) {
    throw new Error('Creation field is read only!');
  }
  this.updatedAt = Date.now();
  next();
});

logSchema.statics.add = async function add(eventType, info) {
  if (!eventType || !info) {
    throw new TypeError('Log type or info not specified.');
  }
  // eslint-disable-next-line new-cap
  const log = new mongoose.model('Log')({ eventType, info });
  await log.save();
  return log;
}

module.exports = mongoose.model('Log', logSchema);
