const User = require('../models/user')
const Token = require('../models/Token')
const outputApi = require('../helpers/responseApi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const dateFormat = require('dateformat')

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
        if(!user) {
          return outputApi.responseError(403, {message:"Username not found"}, res) // username not found
        }

        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if(result) {
            const accessToken = jwt.sign({
              id: user.id,
              username:user.username,
              email: user.email
            },
              config.jwt.secretKey, {
                expiresIn: config.jwt.lifeTime 
            })

            const refreshToken = jwt.sign({
              id: user.id,
              username:user.username,
              email: user.email
            },
              config.jwt.secretKey, {
                expiresIn: config.jwt.refreshLifeTime 
            })

            var outputJwt = {
              "token_type": "Bearer",
              "expires_in": config.jwt.lifeTime,
              "access_token": accessToken,
              "refresh_token": refreshToken
            }
            
            // save access_token and refresh_token to DB
            var now = new Date()
            var dataToken = {
              "access_token": accessToken,
              "refresh_token": refreshToken,
              "is_used": 0,
              "created_at": dateFormat(now, "isoDateTime")
            }
            Token.create(dataToken)
              .then(() => {
                return outputApi.responseSuccess(200, true, "Success login", outputJwt, res)
              })
              .catch((err) => {
                return outputApi.responseError(400, {message: err}, res)
              })

          } else {
            return outputApi.responseError(403, {message:"Wrong password"}, res) // wrong password
          }
        })  
      })
    })
  } catch (err) {
    return outputApi.responseError(500, { message: err }, res)
  }
}

exports.logout = (req,res) => {
  
}

exports.decodeJWT = (req,res) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') { // Authorization: Bearer {access_token}
    // Handle token presented as a Bearer token in the Authorization header
    var decoded = jwt.decode(req.headers.authorization.split(' ')[1])

    outputApi.responseSuccess(200, true, 'Success decode', decode, res)
  }
}