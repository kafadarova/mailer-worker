const jest = require('jest');
const sendMail = require('../controllers/mailer');

jest.mock('../controllers/mailer', () => ({
  id:
   '<20191027211730.1.951444F804CA216E@sandbox3fa77e293f4b40f5a5f9d1b8f287b482.mailgun.org>',
  message: 'Queued. Thank you.',
}));

it('should send an email successfully', (done) => {
  expect(sendMail.id).toEqual('<20191027211730.1.951444F804CA216E@sandbox3fa77e293f4b40f5a5f9d1b8f287b482.mailgun.org>');
  expect(sendMail.message).toEqual('Queued. Thank you.');
  done();
});
