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
    }
  ],
  action: async ({ script, args }) => {
    const full_path = path.join(process.cwd(), script)
    const parsed_args = args.split(',').filter(a => a).reduce((out, a) => {
      const [k, v] = a.split('=')
      out[k] = v
      return out
    }, {})

    await require(full_path)(parsed_args)
  }
}