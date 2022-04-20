const argv = require('yargs').argv
require('dotenv').config({ path: argv.envFile })

module.exports = {
  DEVELOPMENT: process.env.DEVELOPMENT === 'true',
  ACCOUNT_KEY: process.env.ACCOUNT_KEY,
  CACHE_URL: process.env.CACHE_URL,
  CACHE_EXPIRE_IN_S: parseInt(process.env.CACHE_EXPIRE_IN_S || '3600'),
  EXTRA_KEYS: (process.env.EXTRA_KEYS || '').split(',').filter(k => k),
  MUMBAI_NODE_RPC_URL: process.env.MUMBAI_NODE_RPC_URL,
  ARCHIVE_NODE_RPC_URL: process.env.ARCHIVE_NODE_RPC_URL,
  LOGS_PATH: process.env.LOGS_PATH,
}