module.exports = {
  name: 'tx',
  description: 'Prints a TX receipt',
  params: [
    {
      name: 'hash',
      description: 'TX hash'
    }
  ],
  action: async ({ hash }) => {
    const result = await web3.eth.getTransactionReceipt(hash)
    console.log(JSON.stringify(result, null, 2))
  }
}