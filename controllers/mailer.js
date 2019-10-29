const log = require('../utils/logger');
const { scheduleEmail, sendNow, sendOnce } = require('./scheduler');

/**
 * @desc Send an email depending on its configuration
 *
 * @param {Object} data - email content with meta data
 * @param {Function} cb - a callback function which will be called after execution
 */
async function sendMail(data, cb) {
  const {
    date,
    sendType,
    repeatType,
    status,
  } = data;
  let result;

  /** Prepare email object for sending
  *
  * We only get the first recipient from the array
  * and send the email to this user. Multiuser functionality
  * could be added later on.
  */
  const email = {
    from: 'Scheduler <info@scheduler.com>',
    to: data.recipient[0],
    text: data.text,
    subject: 'Email Scheduler',
  };

  if (sendType === 'now' && status === 'NEW') {
    log.info('Sending email...');
    sendNow(email, (error, response) => {
      if (error) {
        cb(error, null);
        return;
      }
      log.info('Email sent...');
      result = response;
      cb(null, response);
    });
  } else if (repeatType === 'once' && sendType === 'later') {
    log.info(`Email scheduled for ${date.toISOString()}`);
    sendOnce(email, date, (error, response) => {
      if (error) {
        cb(error, null);
      }
      result = response;
      cb(null, response);
    });
  } else {
    const recurrenceOptions = {
      repeatCount: data.repeatCount,
      repeatType: data.repeatType,
      repeatAt: data.repeatAt,
      neverEnd: data.neverEnd,
      endOn: data.endOn,
      endAfterOccurrences: data.endAfterOccurrences,
    };

    log.info(`Email scheduled for ${date.toISOString()}`);
    scheduleEmail(email, date, recurrenceOptions, (error, response) => {
      if (error) {
        cb(error, null);
      }
      result = response;
      cb(null, response);
    });
  }
  return result;
}

module.exports = sendMail;
