const schedule = require('node-schedule');
const config = require('config');
const moment = require('moment');

const apiKey = config.get('apiKey');
const domain = config.get('domain');

const mailgun = require('mailgun-js')({ apiKey, domain });
const log = require('../utils/logger');
const { checkRepeatType } = require('./helpers');

const errors = {};

/**
 * @desc Send an email immediately
 *
 * @param {Object} email - email content with meta data
 * @param {Function} cb - a callback function which will be called after execution
 * @return {Object} data - mailgun response object
 */
function sendNow(email, cb) {
  let response;
  mailgun.messages().send(email, (error, data) => {
    if (error) {
      errors.status = 'FAILED';
      errors.message = data.message;
      cb(errors, null);
      return;
    }
    log.info('Email sent...');
    response = data;
    cb(null, data);
  });
  return response;
}

/**
 * @desc Send an email on a specific date at a certain time
 *
 * @param {Object} email - email content with meta data
 * @param {Object} date - a date on which the email must be sent
 * @param {Function} cb - a callback function which will be called after execution
 * @return {Object} data - mailgun response object
 */
function sendOnce(email, date, cb) {
  let response;
  schedule.scheduleJob(date, () => {
    mailgun.messages().send(email, (error, data) => {
      if (error) {
        errors.status = 'FAILED';
        errors.message = data.message;
        log.error(errors);
        cb(errors, null);
        return;
      }
      log.info('Email sent...');
      response = data;
      cb(null, data);
    });
  });
  return response;
}

/**
 * @desc Send an email with a custom recurrence
 *
 * @param {Object} email - email content with meta data
 * @param {Object} date - a date on which the email must be sent
 * @param {Object} recurrence - recurrence properties such as 'repeatAt', 'endOn', etc.
 * @param {Function} cb - a callback function which will be called after execution
 * @return {Object} data - mailgun response object
 */
function scheduleEmail(email, scheduleDate, recurrence, cb) {
  const rule = new schedule.RecurrenceRule();
  const year = scheduleDate.getUTCFullYear();
  const month = scheduleDate.getUTCMonth();
  const date = scheduleDate.getUTCDate();
  const hour = scheduleDate.getUTCHours();
  const minute = scheduleDate.getUTCMinutes();
  const second = scheduleDate.getUTCSeconds();
  const fullDate = {
    year, month, date, hour, minute, second,
  };

  let repeatEvery = '';
  let applyRule;
  let buildRule = {};
  let response;

  buildRule = checkRepeatType(recurrence.repeatType, recurrence.repeatAt);
  repeatEvery = buildRule.repeatType;

  // Generate rules
  buildRule.rule.forEach((currentRule) => {
    if (currentRule === 'dayOfWeek') {
      rule.dayOfWeek = buildRule.days;
      return;
    }
    rule[currentRule] = fullDate[currentRule];
  });

  if (recurrence.neverEnd) {
    rule.second = 10;
    applyRule = rule;
  } else if (recurrence.endAfterOccurrences > 0) {
    const startTime = moment.now();
    const endTime = moment().add(recurrence.endAfterOccurrences, repeatEvery);
    applyRule = { start: startTime, end: endTime, rule };
  } else if (recurrence.endOn !== new Date(0).getTime()) {
    const startTime = moment.now();
    const endTime = moment(recurrence.endOn);
    rule.second = 10;
    applyRule = { start: startTime, end: endTime, rule };
  }

  schedule.scheduleJob(applyRule, () => {
    log.info('Now: ', new Date().toLocaleTimeString());
    mailgun.messages().send(email, (error, data) => {
      if (error) {
        errors.status = 'FAILED';
        errors.message = data.message;
        log.error(errors);
        cb(errors, null);
        return;
      }
      log.info('Email sent...');
      response = data;
      cb(null, data);
    });
  });
  return response;
}

module.exports = { scheduleEmail, sendNow, sendOnce };
