const path = require('path')

module.exports = {
  name: 'run:env',
  description: 'Run script scoped to a particular environment',
  params: [
    {
      name: 'envFile',
      description: 'Path to environment file'
    },
    {
      name: 'script',
      description: 'Path to script'
    },
    {
      name: 'args',
      description: 'Script args',
      default: 'a=a'
    },
    {
      name: 'gasPrice',
      description: 'Gas price in wei',
      default: '0'
    },
    {
      name: 'nonce',
      description: 'Nonce',
      default: '0'
    }
  ],
  action: async ({ script, args, gasPrice, nonce }) => {
    process.env.FIXED_GAS_PRICE = gasPrice === '0' ? '0' : gasPrice
    process.env.PRIORITY_FEE = parseInt(process.env.PRIORITY_FEE || 1500000000)
    const full_path = path.join(process.cwd(), script)
    const parsed_args = args.split(',').filter(a => a).reduce((out, a) => {
      const [k, v] = a.split('=')
      out[k] = v
      return out
    }, {})

    parsed_args.nonce = nonce === '0' ? undefined : nonce
    await require(full_path)(parsed_args)
  }
}