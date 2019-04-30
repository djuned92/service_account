var User = require('../models/user')
var outputApi = require('../helpers/responseApi')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')

exports.login = (req,res) => {
  try {
    req.check('username').notEmpty()
    req.check('password').notEmpty()
    req.getValidationResult().then((validationResult) => {
      if(!validationResult.isEmpty()) {
        return outputApi.responseError(422, validationResult.array(), res)
      }
  
      User.findOne({
        where: { username: req.body.username }
      })
      .then(user => {
        if(user == null) {
          return outputApi.responseError(403, {message:"Invalid username or password"}, res)
        }
        // console.log(user.password)
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if(result) {
            const JWTToken = jwt.sign({
              id: user.id,
              username:user.username,
              email: user.email
            },
              "service_account1!.,.,", {
                expiresIn: "2h" 
            })
            var outputJwt = {
              "token_type": "Bearer",
              "expires_in": 7200,
              "access_token": JWTToken
            }
            return outputApi.responseSuccess(200, true, "Success login", outputJwt, res)
          }
          return outputApi.responseError(403, {message:"Invalid username or password"}, res)
        })  
      })
    })
  } catch (err) {
    return outputApi.responseError(500, { message: err }, res)
  }
}

exports.decodeJWT = (req,res) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') { // Authorization: Bearer g1jipjgi1ifjioj
    // Handle token presented as a Bearer token in the Authorization header
    var decoded = jwt.decode(req.headers.authorization.split(' ')[1])

    console.log(decoded)
  }
}