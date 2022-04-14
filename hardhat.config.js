const { EXECUTION_KEYS, DEPLOYMENT_ACCOUNT_KEY, MAINNET_NETWORK_ID, ARCHIVE_NODE_RPC_URL, EXTRA_KEYS } = require('./lib/env')
require("@nomiclabs/hardhat-truffle5")
require("@nomiclabs/hardhat-waffle")
const { removeConsoleLog } = require('hardhat-preprocessor')

const custom_tasks = require('./tasks/index.js')
for (const t of custom_tasks) {
  const new_task = task(t.name, t.description)
  for (const p of t.params || [])
    if (p.default || p.default === 0)
      new_task.addOptionalParam(p.name, p.description, p.default)
    else
      new_task.addParam(p.name, p.description)
  new_task.setAction(t.action)
}

const accounts = [DEPLOYMENT_ACCOUNT_KEY, ...EXECUTION_KEYS, ...EXTRA_KEYS].map(k => `0x${ k }`)

const forking = {
  url: ARCHIVE_NODE_RPC_URL || 'No url'
}
if (process.env.BN)
  forking.blockNumber = parseInt(process.env.BN)

module.exports = {
  defaultNetwork: 'hardhat',
  preprocess: {
     eachLine: removeConsoleLog(_ => !process.env.SHOW_LOGS)
  },
  networks: {
    hardhat: {
      chainId: MAINNET_NETWORK_ID,
      accounts: accounts.map(a => ({
        privateKey: a,
        balance: '1000000000000000000000000000'
      })),
      forking
    },
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/woHUTL1cY6at-XhP24xpQRxaewPU3KxJ',
      gas: "auto",
      gasPrice: 10000000000,
      gasMultiplier: 1.2,
      blockGasLimit: 8000000,
      network_id: 4,
      accounts,
      timeout: 40000,
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.5.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200000
          }
        }
      },
    ]
  },
  paths: {
    sources: "./contracts"
  }
}