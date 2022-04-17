const { 
  DEFAULT_LIMIT, 
  DEFAULT_PAGE, 
  MIN_LIMIT, 
  MIN_PAGE,
  PRODUCT_FIELDS,
  ERRORS
} = require('./constants')

const filtering = (req, res, next) => {
  const filters = {}

  for (const [key, value] of Object.entries(req.query))
    if (key in PRODUCT_FIELDS)
      filters[key] = value

  //TODO VALIDATE VALUE OF FILTERS

  const filteredData = req.data.filter(d => {
    for (const key in Object.keys(filters))
      if (d[key] !== filters[key])
        return false
    return true
  })

  if(typeof next !== "undefined") {
    req.data = filteredData
    return next()
  }

  return res.send(result)
}



const sorting = (req, res, next) => {
  const sortBy = req.query.sortBy,
        orderBy = req.query.orderBy || 'asc'

  if (orderBy !== 'asc' || orderBy !== 'desc')
    return res.status(400).send(ERRORS['bad_order_by'])

  if (sortBy !== undefined && sortBy in PRODUCT_FIELDS)
    req.data = req.data.sort((x, y) => orderBy === 'asc' ? x[sortBy] < y[sortBy] : x[sortBy] > y[sortBy] )

  if(typeof next !== "undefined")
    return next()

  return res.send(req.data)
}

const pagination = (req, res) => {
  const page = Number(req.query.page || DEFAULT_PAGE),
        limit = Number(req.query.limit || DEFAULT_LIMIT)
  
  if (!Number.isInteger(page) || !Number.isInteger(limit))
    return res.status(400).send(ERRORS['bad_pagination'])

  if (page < MIN_PAGE || limit < MIN_LIMIT)
    return res.status(400).send(ERRORS['bad_pagination'])
  
  const start_index = (page - 1) * limit,
        end_index = page * limit,
        result = {}

  result.previous_page = start_index > 0 ? page - 1 : null
  result.next_page = end_index < data.length ? page + 1 : null
  result.results = res.data.slice(start_index, end_index)

  return res.send(result)
}

module.exports = {
  pagination,
  filtering,
  sorting
}