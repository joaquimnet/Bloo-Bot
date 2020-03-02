const mongoose = require('mongoose');

const Bloo = require('./bloo');

const { Schema } = mongoose;

const ideaSchema = new Schema({
  ideaId: {
    type: Number,
    // required: true,
    unique: true,
  },
  title: {
    type: String,
    minlength: 3,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  isDone: {
    type: Boolean,
    default: false,
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

ideaSchema.pre('save', async function preSave(next) {
  if (this.isModified('createdAt')) {
    throw new Error('Creation field is read only!');
  }
  this.updatedAt = Date.now();
  // get next id
  const blooConfig = await Bloo.findOne({})
    .select('stats.currentIdeaId')
    .exec();
  // @_@
  const nextId = blooConfig.stats.currentIdeaId + 1;
  this.ideaId = nextId;
  blooConfig.stats.currentIdeaId += 1;
  await blooConfig.save();
  next();
});

ideaSchema.methods.display = function display() {
  return `<:right:652702479292825600> **[${this.ideaId}]** ${this.title}`;
};

module.exports = mongoose.model('Idea', ideaSchema);
