/* eslint no-underscore-dangle: 0 */
const cron = require('node-cron');
const config = require('config');
const log = require('../utils/logger');
const sendMail = require('./mailer');

const Email = require('../models/email');

const appName = `${config.get('applicationName')}`;

/** For testing purposes you could set
*   the cron job to run every 20 seconds
*/
// */10 * * * * *

// Run the job every minute
cron.schedule('* * * * *', async () => {
  log.info('Running a task at:', new Date().toLocaleTimeString());
  let selector = { status: 'NEW', appName };
  let response;
  let errors;

  if (process.env.NODE_ENV === 'production') {
    selector = {
      status: 'NEW',
    };
  }

  try {
    const emails = await Email.find(selector);
    log.info('New emails: ', emails.length);

    emails.forEach(async (email) => {
      await Email.findOneAndUpdate({ _id: email._id }, { $set: { status: 'SCHEDULED' } });

      sendMail(email, async (error, data) => {
        if (!error) {
          await Email.findOneAndUpdate({ _id: email._id }, { $set: { status: 'SENT' } });
          log.info('MESSAGE:', data.message);
          response = data.message;
          return response;
        }

        await Email.findOneAndUpdate({ _id: email._id }, { $set: { status: 'INVALID' } });
        log.error('ERROR:', error);
        errors = error;
        return errors;
      });
    });
  } catch (e) {
    log.error(e);
    return e;
  }
  return { response, errors };
});
