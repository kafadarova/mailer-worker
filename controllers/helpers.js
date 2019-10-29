const log = require('../utils/logger');

/**
 * @desc Check repeat type and configure a rule
 *
 * @param {Object} type - email content with meta data
 * @param {Object} repeatDays - a date on which the email must be sent
 * @return {Object} data - with repeatType, days and rule
 */
function checkRepeatType(type, repeatDays = []) {
  log.info('Occurrence type: ', type);
  let repeatType = '';
  const rule = [];
  let days = [];

  if (repeatDays.length > 0) {
    repeatDays.forEach((day) => {
      days.push(day);
    });
  }

  days = days.length > 0 ? days : null;

  /** For testing purposes you could set
  *   a rule which sends a message every minute -
  *
  *   repeatType = 'minutes'
  *   rule.push('second');
  */
  switch (type) {
    case 'daily':
      // repeatType = 'days';
      // rule.push('hour', 'minute');
      repeatType = 'minutes'; // Just for testing
      rule.push('second');
      break;
    case 'weekly':
      repeatType = 'weeks';
      rule.push('hour', 'minute', 'dayOfWeek');
      break;
    case 'monthly':
      repeatType = 'months';
      rule.push('date', 'hour', 'minute');
      break;
    case 'yearly':
      repeatType = 'years';
      rule.push('month', 'date', 'hour', 'minute');
      break;
    default:
  }

  return { repeatType, days, rule };
}

module.exports = { checkRepeatType };
