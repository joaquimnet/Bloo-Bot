const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const guildSettingsSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  listenerSettings: {
    allow: {
      type: Boolean,
      default: true,
    },
    ignored: { type: [String], default: [] },
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

guildSettingsSchema.statics.getOrCreate = async function getOrCreate(guildId) {
  let gSettings;
  try {
    gSettings = await this.findOne({ guildId });
    if (gSettings) {
      return gSettings;
    }
    // eslint-disable-next-line new-cap
    gSettings = new mongoose.model('GuildSettings')({ guildId });
    await gSettings.save();
    return gSettings;
  } catch (err) {
    err.stack = `[GuildSettings] Could not get settings for guild with id: ${guildId}\n\n` + err.stack;
    throw err;
  }
};

guildSettingsSchema.pre('save', function preSave(next) {
  if (this.isModified('createdAt')) {
    throw new Error('Creation field is read only!');
  } else {
    next();
  }
});

guildSettingsSchema.pre('save', function preSave(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('GuildSettings', guildSettingsSchema);
