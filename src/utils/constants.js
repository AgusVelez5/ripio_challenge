const ERRORS = {
  BAD_PAGINATION: "Page and limit must be integers numbers greater than 1",
  BAD_ORDER_BY: "orderBy field must be 'asc' or 'desc'",
  SERVER_ERROR: "Server error"
}

const PRODUCT_FIELDS = ['id', 'name', 'status', 'owner', 'newOwner']

const HTTP_STATUS = (status, data) => ({ status, data })

module.exports = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  DEFAULT_ORDER_BY: 'asc',
  MIN_PAGE: 1, 
  MIN_LIMIT: 5, 
  PRODUCT_CONTRACT_ADDRESS: "0xd9E0b2C0724F3a01AaECe3C44F8023371f845196",
  PORT: 3000,
  HTTP_STATUS,
  PRODUCT_FIELDS,
  ERRORS
}