const moment = require('moment');

module.exports = t => new moment(t || undefined).tz('America/New_York');
