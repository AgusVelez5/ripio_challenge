const express = require('express')
const router = express.Router()
const { validator, schemas } = require('../../utils/validator')
const { 
  pagination,
  filtering,
  sorting 
} = require('../../utils/middlewares')
const {
  getProductsService,
  getDelegatedProductsService,
  delegateProductService,
  createProductService,
  acceptProductService
} = require('./services')


// CONTROLLERS
const getProducts = async (req, res, next) => {
  const data_schema = {
    id: schemas['id'],
    name: schemas['name'],
    status: schemas['status'],
    owner: schemas['address'],
    newOwner: schemas['address'],
    sortBy: schemas['sortBy'],
    orderBy: schemas['orderBy'],
    page: schemas['page'],
    limit: schemas['limit'],
    refresh: schemas['refresh']
  }

  if (typeof validator(data_schema, req.query) === 'string')
    return res.status(400).send(validator(data_schema, req.query))


  const result = await getProductsService(req.query.refresh)

  if(next && result.status !== 500) {
    req.data = result.data
    return next()
  }

  res.status(result.status).send(result.data)
}

const createProduct = async (req, res) => {
  const data_schema = { 
    name: schemas['name'].required() 
  }

  if (typeof validator(data_schema, req.body) === 'string')
    return res.status(400).send(validator(data_schema, req.body))

  const result = await createProductService(req.body.name)

  res.status(result.status).send(result.data)
}

const getDelegatedProducts = async (req, res, next) => {
  const data_schema = { 
    addr: schemas['address'].required(),
    id: schemas['id'],
    name: schemas['name'],
    status: schemas['status'],
    owner: schemas['address'],
    newOwner: schemas['address'],
    sortBy: schemas['sortBy'],
    orderBy: schemas['orderBy'],
    page: schemas['page'],
    limit: schemas['limit'],
    refresh: schemas['refresh']
  }

  if (typeof validator(data_schema, { ...req.params, ...req.query }) === 'string')
    return res.status(400).send(validator(data_schema, { ...req.params, ...req.query }))

  const result = await getDelegatedProductsService(req.params.addr, req.query.refresh)

  if(next && result.status !== 500) {
    req.data = result.data
    return next()
  }

  res.status(result.status).send(result.data)
}

const delegateProduct = async (req, res) => {
  const data_schema = { 
    id: schemas['id'].required(), 
    addr: schemas['address'].required() 
  }

  if (typeof validator(data_schema, req.body) === 'string')
    return res.status(400).send(validator(data_schema, req.body))

  const result = await delegateProductService(req.body.id, req.body.addr)

  res.status(result.status).send(result.data)
}

const acceptProduct = async (req, res) => {
  const data_schema = { 
    id: schemas['id'].required(), 
    addr: schemas['address'].required() 
  }

  if (typeof validator(data_schema, req.body) === 'string')
    return res.status(400).send(validator(data_schema, req.body))

  const result = await acceptProductService(req.body.id, req.body.addr)

  res.status(result.status).send(result.data)
}

// ROUTES
router.route('/').get(getProducts, filtering, sorting, pagination)
router.route('/').post(createProduct)
router.route('/delegates/:addr').get(getDelegatedProducts, filtering, sorting, pagination)
router.route('/delegates').post(delegateProduct)
router.route('/delegates/accept').post(acceptProduct)

module.exports = router
