const Joi = require('joi')

const schemas = {
  address: Joi.string().hex().length(42).required(),
  name: Joi.string().required(),
  id: Joi.number().integer().required()
}

const validator = (schemas, data) => {
  const schema = Joi.object(schemas)
  const { value, error } = schema.validate(data)
  if (error) return error 
  
  return value
}

module.exports = {
  schemas,
  validator
}