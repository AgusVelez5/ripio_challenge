require('dotenv').config()
const express = require('express')
const { logger } = require('./utils/logger')
const app = express()
const port = process.env.PORT || 3000 
const router = express.Router()
const bodyParser = require('body-parser')
const cors = require('cors')

const swaggerUi = require('swagger-ui-express'),
      swaggerDocument = require('./docs/swagger.json')

app.use(cors())

app.use(
  '/api/docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use( (req, _, done) => {
  logger.info(`path: ${req.originalUrl}`)
  logger.info(JSON.stringify(req.body))
  done()
})


app.use(router)

app.use((req, res, _) => res.status(404).json(HTTP_STATUS(404, `${req.url} Not found`)))

app.listen(port, () => {
  console.log("Express Listening at http://localhost:" + port)
})


/* 



GET  /v1/products - Ver todos los productos disponibles con el detalle correspondiente.   // Filter by name, status, owner, newOwner - Also add pagination and sorting
POST /v1/products (body :product_name) - Crear un producto nuevo desde una wallet configurada en el backend.
GET  /v1/products/delegates/:addr - Ver todos los productos que tiene delegados determinada wallet // Filter by name, status, owner, newOwner - Also add pagination and sorting
POST /v1/products/delegates (body :addr) - Delegar un producto a una wallet desde una wallet configurada en el backend.
POST /v1/products/delegates/accept (body :product_id) -  Aceptar una delegación de un producto.


*/