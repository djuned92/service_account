const outputApi = require('../helpers/responseApi')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

module.exports = (req,res,next) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') { // Authorization: Bearer g1jipjgi1ifjioj
    // Handle token presented as a Bearer token in the Authorization header
    jwt.verify(req.headers.authorization.split(' ')[1], config.jwt.secretKey, 
      ((err, decoded) => {
        if(typeof decoded !== 'undefined') {
          next()
        } else {
          return outputApi.responseError(401, {message:'Token invalid'}, res)
        }
      })
    )
  } else {
    return outputApi.responseError(401, {message:"Missing token", hint:"1. set in Authorization : Type Bearer Token {token}, 2. set in Headers : params Authorization and value Bearer{space}{token}"}, res)
  }
}
