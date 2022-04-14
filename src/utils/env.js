require('dotenv')

module.exports = {
  DEVELOPMENT: process.env.DEVELOPMENT === 'true',
  LOGS_PATH: process.env.LOGS_PATH,
}