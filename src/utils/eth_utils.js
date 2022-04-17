const { DEVELOPMENT, FEE_HISTORY_RPC_HTTP_URL } = require('./env')
const BigNumber = require('bignumber.js')
const { web3 } = require("hardhat")
const Web3 = require('web3')

const fee_history_web3 = FEE_HISTORY_RPC_HTTP_URL ? new Web3(FEE_HISTORY_RPC_HTTP_URL) : web3

const nextNonce = (account, default_block = 'latest') => web3.eth.getTransactionCount(account.address, default_block)

const estimateGasPrice = async _ => {
  if (DEVELOPMENT)
    return {
      standard: '100000000000',
      fast:     '1000000000000',
      fastest:  '10000000000000'
    }

  const base_price = new BigNumber(parseInt((await fee_history_web3.eth.getFeeHistory(2, 'latest', [0])).baseFeePerGas.pop())) /* next block base fee */

  return {
    standard: base_price.times(1.15).integerValue().toFixed(),
    fast: base_price.times(1.2).integerValue().toFixed(),
    fastest: base_price.times(2).integerValue().toFixed()
  }
}

const updateTxTo1559 = tx => {
  tx.type = 2
  tx.maxPriorityFeePerGas = process.env.PRIORITY_FEE
  tx.maxFeePerGas = parseInt(process.env.PRIORITY_FEE) + parseInt(tx.gasPrice)
  delete tx.gasPrice
  return tx
}

const transferETH = async (account, to, value, options) => {
  let tx = {
    nonce: await nextNonce(account),
    to,
    value,
    ...options
  }

  const signed_tx = await account.signTransaction(tx)
  return await web3.eth.sendSignedTransaction(signed_tx.rawTransaction)
}

const keyToAccount = k => web3.eth.accounts.privateKeyToAccount(`0x${ k }`)

const keysToAccounts = keys => keys.map(keyToAccount)

const sendTransaction = async (account, to, options = {}) => {
  const tx = { gas: 21000, value: '0x0', nonce: account.nonce, from: account.address, to, ...options }

  const signed_tx = await account.account.signTransaction(tx)
  return await new Promise(r => {
    const a = web3.eth.sendSignedTransaction(signed_tx.rawTransaction)
    a.on('transactionHash', r)
  })
}

const networkId = (_ => {
  let nid
  return async _ => {
    nid = nid || await web3.eth.net.getId()
    return nid
  }
})();

module.exports = {
  nextNonce,
  estimateGasPrice,
  updateTxTo1559,
  transferETH,
  keyToAccount,
  keysToAccounts,
  sendTransaction,
  networkId,
}