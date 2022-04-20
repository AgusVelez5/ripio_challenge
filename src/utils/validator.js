const Joi = require('joi')

const schemas = {
  address: Joi.string().replace('0x', '').lowercase().length(40).hex(),
  name: Joi.string(),
  id: Joi.number().integer().positive(),
  status: Joi.number().integer().valid(0, 1),
  sortBy: Joi.string().valid('id', 'name', 'status', 'owner', 'newOwner'),
  orderBy: Joi.string().valid('asc','desc'),
  page: Joi.number().integer().positive(),
  limit: Joi.number().integer().min(5),
  refresh: Joi.boolean()
}

const validator = (schemas, data) => {
  const schema = Joi.object(schemas)
  const { value, error } = schema.validate(data)
  if (error) return error.details[0].message
  
  return value
}

module.exports = {
  schemas,
  validator
}