const { updateTxTo1559 } = require('./eth_utils')
const { web3 } = require("hardhat")

const Contract = contract => {
  
  const method_instance = (m, p = {}) => contract.contract.methods[m](...Object.values(p))

  const invoke = (method, params) => method_instance(method, params).call()

  const estimateGas = async (method, params, options, multiplier = 1) => {
    const options_without_gas_price = { ...options }
    delete options_without_gas_price.gasPrice
    return await method_instance(method, params).estimateGas(options_without_gas_price).then(g => Math.ceil(g * multiplier))
  }

  const signWith = async (account, method, params, options) => {
    let tx = {
      to: contract.address,
      data: method_instance(method, params).encodeABI(),
      ...options
    }
    return await account.signTransaction(tx)
  }

  const invokeFrom = async (account, method, params, options) => {
    const signed_tx = await signWith(account, method, params, options)
    return await new Promise((resolve, reject) => {
      const tx = web3.eth.sendSignedTransaction(signed_tx.rawTransaction)
      tx.on('transactionHash', resolve)
      tx.on('error', reject)
    })
  }

  const invokeFromSync = async (account, method, params, options) => {
    const signed_tx = await signWith(account, method, params, options)
    return await web3.eth.sendSignedTransaction(signed_tx.rawTransaction).catch(console.log)
  }

  const estimateGasAndInvokeFrom = async (account, method, params, options = {}, gas_multiplier) => {
    options.from = account.address
    const gas = await estimateGas(method, params, options, gas_multiplier)
    return await invokeFromSync(account, method, params, { gas, ...options })
  }

  const estimateGasAndBuildTx = async (account, method, params, options = {}, gas_multiplier) => {
    options.from = options.from || account.address
    const gas = await estimateGas(method, params, options, gas_multiplier)
    return buildTx(account, method, params, { ...options, gas })
  }

  const buildTx = (account, method, params, options = {}) => {
    options.from = options.from || account.address
    return {
      to: contract.address,
      data: method_instance(method, params).encodeABI(),
      ...options
    }
  }

  const balanceOf = address => invoke('balanceOf', { address })

  return {
    invoke,
    estimateGas,
    signWith,
    invokeFrom,
    invokeFromSync,
    estimateGasAndInvokeFrom,
    estimateGasAndBuildTx,
    buildTx,
    address: contract.address,
    balanceOf,
    contract 
  }
}

module.exports = Contract