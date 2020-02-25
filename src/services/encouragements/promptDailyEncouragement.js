const Prompter = require('chop-prompter');

module.exports = async (channel, user) => {
  // "would you like to receive my daily encouragements in ur dms?" // yes no
  const question = 'Would you like to opt in to my daily encouragements? Sent privately in your dms of course! :blue_heart: This is a new concept and tons of people seem to really enjoy it!'; // im fucking stupid idk what to write
  const response = await Prompter.confirm({
    channel,
    question: '\n' + question,
    userId: user.id
  });
  return response;
}
