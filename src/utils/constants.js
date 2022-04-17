const ERRORS = {
  bad_pagination: "Page and limit must be integers numbers greater than 1",
  bad_order_by: "orderBy field must be 'asc' or 'desc'"
}

const PRODUCT_FIELDS = ['name', 'status', 'owner', 'newOwner']

module.exports = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MIN_PAGE: 1, 
  MIN_LIMIT: 5, 
  PRODUCT_CONTRACT_ADDRESS: "0xd9E0b2C0724F3a01AaECe3C44F8023371f845196",
  PRODUCT_FIELDS,
  ERRORS
}