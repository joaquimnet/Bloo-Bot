const moment = require('./moment');

module.exports = date => {
  const now = moment();
  const before = moment(date);
  return before.isBefore(now, 'day');
}
