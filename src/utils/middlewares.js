const { 
  DEFAULT_LIMIT, 
  DEFAULT_PAGE,
  DEFAULT_ORDER_BY,
  MIN_LIMIT, 
  MIN_PAGE,
  PRODUCT_FIELDS,
  ERRORS
} = require('./constants')

const filtering = (req, res, next) => {
  const filters = {}

  for (const [key, value] of Object.entries(req.query))
    if (PRODUCT_FIELDS.includes(key))
      filters[key] = value

  const filteredData = req.data.filter(d => {
    for (const key of Object.keys(filters)) {
      if (key === 'status' && parseInt(d[key]) === parseInt(filters[key]))
        return true
      if (d[key] !== filters[key])
        return false
    }
    return true
  })

  if(next) {
    req.data = filteredData
    return next()
  }

  return res.send(result)
}

const sorting = (req, res, next) => {
  const sortBy = req.query.sortBy,
        orderBy = req.query.orderBy || DEFAULT_ORDER_BY

  if (sortBy !== undefined && PRODUCT_FIELDS.includes(sortBy)) {
    if (orderBy !== 'asc' && orderBy !== 'desc')
      return res.status(400).send(ERRORS['BAD_ORDER_BY'])
    req.data = req.data.sort((x, y) => orderBy === 'asc' ? x[sortBy].toLowerCase() > y[sortBy].toLowerCase() ? 1 : -1 : x[sortBy].toLowerCase() > y[sortBy].toLowerCase() ? -1 : 1 )
  }

  if(next)
    return next()

  return res.send(req.data)
}

const pagination = (req, res) => {
  const page = Number(req.query.page || DEFAULT_PAGE),
        limit = Number(req.query.limit || DEFAULT_LIMIT)

  if (!Number.isInteger(page) || !Number.isInteger(limit))
    return res.status(400).send(ERRORS['BAD_PAGINATION'])

  if (page < MIN_PAGE || limit < MIN_LIMIT)
    return res.status(400).send(ERRORS['BAD_PAGINATION'])
  
  const out_of_range = req.data.length < (page * limit),
        start_index = out_of_range ? req.data.length - (req.data.length % limit) : (page - 1) * limit,
        end_index = out_of_range ? req.data.length : page * limit,
        result = {}

  result.previous_page = start_index > 0 ? out_of_range ? parseInt(req.data.length / limit) : page - 1 : null
  result.next_page = end_index < req.data.length ? page + 1 : null
  result.results = req.data.slice(start_index, end_index)

  return res.send(result)
}

module.exports = {
  pagination,
  filtering,
  sorting
}