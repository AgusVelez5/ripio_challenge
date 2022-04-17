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
  req.data = await getProductsService()

  next()
}

const createProduct = async (req, res) => {
  if (typeof validator({ name: schemas['name'] }, req.body) === String)
    return res.status(400).send(validator({ name: schemas['name'] }, req.body))

  const result = await createProductService(req.query.hashes)

  res.status(200).send(result)
}

const getDelegatedProducts = async (req, res, next) => {
  if (typeof validator({ addr: schemas['address'] }, req.params) === String)
    return res.status(400).send(validator({ addr: schemas['address'] }, req.params))

  req.data = await getDelegatedProductsService(req.params.addr)

  next()
}

const delegateProduct = async (req, res) => {
  if (typeof validator({ addr: schemas['address'] }, req.body) === String)
    return res.status(400).send(validator({ addr: schemas['address'] }, req.body))

  const result = await delegateProductService(req.query.hashes)

  res.status(200).send(result)
}

const acceptProduct = async (req, res) => {
  if (typeof validator({ id: schemas['id'] }, req.body) === String)
    return res.status(400).send(validator({ addr: schemas['id'] }, req.body))

  const result = await acceptProductService(req.query.hashes)

  res.status(200).send(result)
}

// ROUTES
router.route('/').get(getProducts, filtering, sorting, pagination)
router.route('/').post(createProduct)
router.route('/delegates/:addr').get(getDelegatedProducts, filtering, sorting, pagination)
router.route('/delegates').post(delegateProduct)
router.route('/delegates/accept').post(acceptProduct)


module.exports = router


/* 



GET  /v1/products - Ver todos los productos disponibles con el detalle correspondiente.   // Filter by name, status, owner, newOwner - Also add pagination and sorting
POST /v1/products (body :product_name) - Crear un producto nuevo desde una wallet configurada en el backend.
GET  /v1/products/delegates/:addr - Ver todos los productos que tiene delegados determinada wallet // Filter by name, status, owner, newOwner - Also add pagination and sorting
POST /v1/products/delegates (body :addr) - Delegar un producto a una wallet desde una wallet configurada en el backend.
POST /v1/products/delegates/accept (body :product_id) -  Aceptar una delegación de un producto.


*/