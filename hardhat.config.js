const { ACCOUNT_KEY, ARCHIVE_NODE_RPC_URL, EXTRA_KEYS, MUMBAI_NODE_RPC_URL } = require('./src/utils/env')
require("@nomiclabs/hardhat-truffle5")
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-web3");

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

const accounts = [ACCOUNT_KEY, ...EXTRA_KEYS].map(k => `0x${ k }`)

const forking = {
  url: ARCHIVE_NODE_RPC_URL || 'No url'
}
if (process.env.BN)
  forking.blockNumber = parseInt(process.env.BN)

module.exports = {
  defaultNetwork: 'mumbai',
  networks: {
    hardhat: {
      chainId: 137,
      accounts: accounts.map(a => ({
        privateKey: a,
        balance: '1000000000000000000000000000'
      })),
      forking
    },
    mumbai: {
      url: MUMBAI_NODE_RPC_URL,
      gas: "auto",
      gasPrice: 10000000000,
      gasMultiplier: 1.2,
      blockGasLimit: 8000000,
      network_id: 80001,
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
            runs: 200
          }
        }
      },
    ]
  },
  paths: {
    sources: "./contracts"
  }
}