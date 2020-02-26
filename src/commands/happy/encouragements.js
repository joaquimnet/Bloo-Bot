const { Command } = require('chop-tools');

const Bloo = require('../../models/bloo');
const { promptDailyEncouragement } = require('../../services/encouragements');

module.exports = new Command({
  name: 'dailycourage',
  description: 'Would you like a little bit of encouragement everyday? We know it helps to have someone be there. Get daily motivational messages from Bloo in your dms.',
  category: 'happy',
  aliases: ['encouragements', 'dailymotivation', 'motivation'],
  async run(message, args, call) {
    const description = `Daily encouragements are sent privately to you via dms. I have a bunch of motivational encouragements tucked away, and I will pick one everyday to send you if you opt in. `
    // brainstorming. 
    await this.send(description);
    const dailyEncouragements = await promptDailyEncouragement(message.channel, message.author);
    if (dailyEncouragements) {
      this.send('Owo okay :blue_heart: I\'ll make sure to remember to send you an encouragement everyday.');
      // save settings to db
      call.profile.encouragementSettings.optedIn = true;
      call.profile.encouragementSettings.startDate = new Date();
      await call.profile.save();
      await Bloo.addUserToEncouragementList(call.caller);
    } else {
      this.send('Okay... :(');
      call.profile.encouragementSettings.optedIn = false;
      await call.profile.save();
      await Bloo.removeUserFromEncouragementList(call.caller);
    }
  },
});
