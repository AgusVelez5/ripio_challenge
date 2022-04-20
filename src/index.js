const compression = require('compression')
const express = require('express')
const { logger } = require('./utils/logger')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const cors = require('cors')
const productsRoutes = require('./api/products')
const { PORT } = require('./utils/constants')

const swaggerUi = require('swagger-ui-express'),
      swaggerDocument = require('../docs/swagger.json')

app.use(compression())
app.use(cors())

app.use(
  '/api/docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument, {
    customCss: '.topbar { display: none }',
    customSiteTitle: 'Ripio challenge docs'
  })
);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use( (req, _, done) => {
  logger.info(`path: ${req.originalUrl}`)
  logger.info(JSON.stringify(req.body))
  done()
})

router.use('/api/v1/products', productsRoutes)

app.use(router)

app.use((req, res, _) => res.status(404).json(`${req.url} Not found`))

app.listen(PORT, () => console.log(`Express Listening at http://localhost:${PORT}`))
