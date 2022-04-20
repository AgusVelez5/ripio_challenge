const loadContract = require('../../utils/load_deployed_contract_at_address')
const { ACCOUNT_KEY, CACHE_URL, CACHE_EXPIRE_IN_S, EXTRA_KEYS } = require('../../utils/env')
const { PRODUCT_CONTRACT_ADDRESS, HTTP_STATUS, ERRORS } = require('../../utils/constants')
const { CacheManager, keyToAccount, keysToAccounts } = require('../../utils/utils')
const { web3 } = require("hardhat")
const { logger } = require('../../utils/logger')
const cache = new CacheManager(CACHE_URL)


const owner = keyToAccount(ACCOUNT_KEY)
const extra_accounts = keysToAccounts(EXTRA_KEYS)

const getProductInstance = async () => {
  const baseContract = await loadContract('ProductFactory', PRODUCT_CONTRACT_ADDRESS)
  return require('../../utils/contract')(baseContract)
}

const getNextIndex = currentIndex => {
  const index = BigInt(currentIndex) + 1n
  let hexIndex = BigInt(index).toString(16)
  if (hexIndex.length % 2)
    hexIndex = '0' + hexIndex
  hexIndex = '0x' + hexIndex
  return [index, hexIndex]
}

// SERVICES
const getProductsService = async (refresh) => {
  try {
    const products_length = parseInt(await web3.eth.getStorageAt(PRODUCT_CONTRACT_ADDRESS, 0), 16),
          saved_products_length = await cache.get('products_length')

    if (products_length !== saved_products_length)
      cache.store('products_length', products_length)

    refresh = refresh === "true" ? true : false

    return HTTP_STATUS(200, await cache.get_or_store('products', CACHE_EXPIRE_IN_S, products_length !== saved_products_length || refresh, async _ => {
      const products = []
      let [first_index, hex_first_index] = [web3.utils.soliditySha3(0), web3.utils.soliditySha3(0)]

      for (let i = 0; i < products_length; i++) {
        const [second_index, hex_second_index] = getNextIndex(first_index)
        const [third_index, hex_third_index] = getNextIndex(second_index)

        const hex_indexes = [hex_first_index, hex_second_index, hex_third_index]
        const [first_storage, second_storage, third_storage] = await Promise.all(hex_indexes.map(hex_index => web3.eth.getStorageAt(PRODUCT_CONTRACT_ADDRESS, hex_index)))

        const name = web3.utils.hexToUtf8(first_storage), // Known bug, remove null values from hexToUtf8 result
              status = second_storage.slice(second_storage.length - 2, second_storage.length),
              owner = `0x${second_storage.slice(second_storage.length - 42, second_storage.length - 2)}`,
              newOwner = `0x${third_storage.slice(second_storage.length - 40, second_storage.length)}`

        products.push({
          id: `${i}`,
          name,
          status,
          owner,
          newOwner
        })

        first_index = getNextIndex(third_index)[0]
        hex_first_index = getNextIndex(third_index)[1]
      }

      return products
    }))
  } catch (err) {
    logger.error(err)
    return HTTP_STATUS(500, ERRORS['SERVER_ERROR'])
  }
}

const createProductService = async product_name => {
  try {
    const productInstance = await getProductInstance(),
          res = await productInstance.estimateGasAndInvokeFrom(owner, 'createProduct', { _name: product_name })

    return HTTP_STATUS(200, `Product created in the tx ${res.transactionHash} in the block ${res.blockNumber}`)
  } catch (err) {
    logger.error(err)
    return HTTP_STATUS(500, ERRORS['SERVER_ERROR'])
  }
}

const getDelegatedProductsService = async (address, refresh) => {
  const res = await getProductsService(refresh)

  if (typeof res.data === 'string')
    return res

  const delegatedProducts = res.data.filter(p => p.newOwner.toLowerCase() === address.toLowerCase())

  return HTTP_STATUS(200, delegatedProducts)
}

const delegateProductService = async (product_id, new_owner_address) => {
  try {
    const productInstance = await getProductInstance(),
          res = await productInstance.estimateGasAndInvokeFrom(owner, 'delegateProduct', { _productId: product_id, _newOwner: new_owner_address })

    return HTTP_STATUS(200, `Product delegated in the tx ${res.transactionHash} in the block ${res.blockNumber}`)
  } catch (err) {
    logger.error(err)
    return HTTP_STATUS(500, ERRORS['SERVER_ERROR'])
  }
}

const acceptProductService = async (product_id, acceptor_address) => {
  try {
    const acceptor_account = extra_accounts.filter(a => a.address.toLowerCase() === acceptor_address.toLowerCase())
    if (acceptor_account === [])
      return HTTP_STATUS(400, `Address ${acceptor_address} is not known`)

    const productInstance = await getProductInstance(),
          res = await productInstance.estimateGasAndInvokeFrom(acceptor_account[0], 'acceptProduct', { _productId: product_id })

    return HTTP_STATUS(200, `Product accepted in the tx ${res.transactionHash} in the block ${res.blockNumber}`)
  } catch (err) {
    logger.error(err)
    return HTTP_STATUS(500, ERRORS['SERVER_ERROR'])
  }
}

module.exports = {
  getProductsService,
  createProductService,
  getDelegatedProductsService,
  delegateProductService,
  acceptProductService
}