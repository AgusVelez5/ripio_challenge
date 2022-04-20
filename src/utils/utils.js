const { DEVELOPMENT } = require('./env')
const { web3 } = require("hardhat")

const CacheManager = DEVELOPMENT ? require('./dev_cache_manager') : require('./cache_manager')

const sleep = ms => new Promise(r => setTimeout(r, ms))

const log = (...args) => console.log(`${new Date().toISOString()} -`, ...args)

const keyToAccount = k => web3.eth.accounts.privateKeyToAccount(`0x${ k }`)

const keysToAccounts = keys => keys.map(keyToAccount)

module.exports = {
  sleep,
  log,
  CacheManager,
  keyToAccount,
  keysToAccounts
}


