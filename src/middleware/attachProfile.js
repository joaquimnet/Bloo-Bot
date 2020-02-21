const Profile = require('../models/profile');

module.exports = (call, next) => {
  Profile.getOrCreate(call.caller)
    .then(profile => {
      call.profile = profile;
      if (profile.lastKnownName !== call.callerUsername) {
        profile.lastKnownName = call.callerUsername;
        profile.save().then(() => next());
        return;
      }
      next();
    })
    .catch(() => {});
};
