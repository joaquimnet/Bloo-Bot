const moment = require('moment');

module.exports = (date1, date2) => {
  return moment(date2).valueOf() - moment(date1).valueOf();
};
