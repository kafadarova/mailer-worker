const mongoose = require('mongoose');

const { Schema } = mongoose;

const EmailSchema = new Schema({
  appName: String,
  text: String,
  recipient: [String],
  date: {
    type: Date,
    default: new Date(0),
  },
  sendType: {
    type: String,
    default: 'now',
  },
  status: {
    type: String,
    default: 'NEW',
  },
  repeatCount: {
    type: Number,
    default: 0,
  },
  repeatType: {
    type: String,
    default: 'once',
  },
  repeatAt: [Number],
  neverEnd: {
    type: Boolean,
    default: false,
  },
  endOn: {
    type: Date,
    default: new Date(0),
  },
  endAfterOccurrences: {
    type: Number,
    default: 0,
  },
},
{ collection: 'email' });

module.exports.email = EmailSchema;
