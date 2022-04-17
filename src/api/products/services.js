const loadContract = require('../../utils/load_deployed_contract_at_address')
const { keyToAccount } = require('../../utils/eth_utils')
const { ACCOUNT_KEY } = require('../../utils/env')
const { PRODUCT_CONTRACT_ADDRESS } = require('../../utils/constants')
const owner = keyToAccount(ACCOUNT_KEY)
const from = owner.address
const { web3 } = require("hardhat")

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

const getProductsService = async () => {
  const products = []
  const products_length = parseInt(await web3.eth.getStorageAt(PRODUCT_CONTRACT_ADDRESS, 0), 16)
  let [first_index, hex_first_index] = [web3.utils.soliditySha3(0), web3.utils.soliditySha3(0)]

  for (let i = 0; i <= products_length; i++) {
    const first_storage = await web3.eth.getStorageAt(PRODUCT_CONTRACT_ADDRESS, hex_first_index)

    const [second_index, hex_second_index] = getNextIndex(first_index)
    const second_storage = await web3.eth.getStorageAt(PRODUCT_CONTRACT_ADDRESS, hex_second_index)

    const [third_index, hex_third_index] = getNextIndex(second_index)
    const third_storage = await web3.eth.getStorageAt(PRODUCT_CONTRACT_ADDRESS, hex_third_index)

    const name = web3.utils.toAscii(first_storage),
          status = second_storage.slice(second_storage.length - 2, second_storage.length),
          owner = `0x${second_storage.slice(second_storage.length - 42, second_storage.length - 2)}`,
          newOwner = `0x${third_storage.slice(second_storage.length - 40, second_storage.length)}`

    products.push({
      name,
      status,
      owner,
      newOwner
    })

    first_index = getNextIndex(third_index)[0]
    hex_first_index = getNextIndex(third_index)[1]
  }

  return products
}

const createProductService = async (product_name) => {
  const productInstance = await getProductInstance()

}

const getDelegatedProductsService = async (address) => {
  

}

const delegateProductService = async (address) => {
  

}

const acceptProductService = async (product_id) => {
  

}


module.exports = {
  getProductsService,
  createProductService,
  getDelegatedProductsService,
  delegateProductService,
  acceptProductService
}