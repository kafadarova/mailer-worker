const jest = require('jest');
const sendNow = require('../controllers/scheduler');
const sendOnce = require('../controllers/scheduler');
const scheduleEmail = require('../controllers/scheduler');

jest.mock('../controllers/scheduler', () => ({
  id:
   '<20191027211730.1.951444F804CA216E@sandbox3fa77e293f4b40f5a5f9d1b8f287b482.mailgun.org>',
  message: 'Queued. Thank you.',
}));

it('should send an email immediately', (done) => {
  expect(sendNow.id).toEqual('<20191027211730.1.951444F804CA216E@sandbox3fa77e293f4b40f5a5f9d1b8f287b482.mailgun.org>');
  expect(sendNow.message).toEqual('Queued. Thank you.');
  done();
});

it('should send an email on a specific date at a certain time', (done) => {
  expect(sendOnce.id).toEqual('<20191027211730.1.951444F804CA216E@sandbox3fa77e293f4b40f5a5f9d1b8f287b482.mailgun.org>');
  expect(sendOnce.message).toEqual('Queued. Thank you.');
  done();
});

it('should send an email with a custom recurrence', (done) => {
  expect(scheduleEmail.id).toEqual('<20191027211730.1.951444F804CA216E@sandbox3fa77e293f4b40f5a5f9d1b8f287b482.mailgun.org>');
  expect(scheduleEmail.message).toEqual('Queued. Thank you.');
  done();
});
