require('dotenv').config();
const express = require('express');
const { initializeDb } = require('./config/db');
const log = require('./utils/logger');

const app = express();
const port = process.env.PORT || 8080;

(async () => {
  await initializeDb();
  require('./controllers/cron');
})();

app.get('/', (req, res) => {
  res.send('Email worker is running ...');
  log.info('Email worker is listening for events...');
});

app.listen(port, () => {
  log.info(`Server is running on port ${port}`);
});
