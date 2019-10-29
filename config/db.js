/* eslint consistent-return: 0 */
const config = require('config');
const mongoose = require('mongoose');

const db = config.get('mongoURI');
const log = require('../utils/logger');

// MongoDB configuration
const mongoOptions = {
  keepAlive: true,
  connectTimeoutMS: 30000,
  reconnectInterval: 1000,
  reconnectTries: Number.MAX_VALUE,
  useNewUrlParser: true,
  autoReconnect: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

// Connect to MongoDB
async function initializeDb() {
  try {
    await mongoose.connect(db, mongoOptions);
    log.info('MongoDB connected...');
  } catch (e) {
    log.error('ERROR: ', e);
    return e;
  }
}

module.exports = { initializeDb };
