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
  money: {
    type: Number,
    default: 0,
  },
});

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
    console.log(`[Profile/getProfile] Could not get profile for id: ${userId}`, err);
    throw err;
  }
};

module.exports = mongoose.model('Profile', profileSchema);
