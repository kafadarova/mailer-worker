module.exports = {
  mongoURI: `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ds335678.mlab.com:35678/mailer`,
  apiKey: process.env.API_KEY,
  domain: process.env.DOMAIN,
  applicationName: process.env.APPLICATION_NAME,
};
