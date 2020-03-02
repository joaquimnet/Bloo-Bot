const moment = require('moment');

module.exports = seconds => moment.duration(seconds).format('HH[H] mm[M] ss[S]');
