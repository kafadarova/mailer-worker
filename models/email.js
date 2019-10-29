const mongoose = require('mongoose');
const { email } = require('./schemas/email.js');

// Email schema
module.exports = mongoose.model('Email', email);
