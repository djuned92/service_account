var User = require('../models/user')
var outputApi = require('../helpers/responseApi')
var bcrypt = require('bcrypt')
var dateFormat = require('dateformat')

exports.getAll = (req,res) => {
  try {
    User.findAll()
    .then(users => {
      return outputApi.responseSuccess(200, true, 'Get all user', users, res)
    })
    .catch(err => {
      return outputApi.responseError(400, {message: err}, res)
    })
  } catch (err) {
    return outputApi.responseError(500, {message: err}, res)
  }
}

exports.getById = (req,res) => {
  try {
    req.check('id').notEmpty()
    req.getValidationResult().then((validationResult) => {
      if(!validationResult.isEmpty()) {
        return outputApi.responseError(422, validationResult.array(), res)
      }
      var id = req.params.id
      User.findByPk(id)
      .then(user => {
        if(user == null) { // not found
          return outputApi.responseError(404, {message:'User not found'}, res)
        } else {
          return outputApi.responseSuccess(200, true, 'Get detail user', user, res)
        }
      })
      .catch(err => {
        return outputApi.responseError(400, {message: err}, res)
      })
    })
  } catch (err) {
    return outputApi.responseError(500,{message:err}, res)
  }
}

exports.create = (req,res) => {
  try {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if(err) {
        return outputApi.responseError(400, {message: err}, res)
      } else {
        var now = new Date()
        var dataUser = {
          "username": req.body.username,
          "password": hash,
          "email": req.body.email,
          "is_active": 0,
          "created_at": dateFormat(now, "isoDateTime")
        }
        User.findOrCreate({ where : {username:req.body.username}, defaults: dataUser})
          .then(([user, created]) => {
            if(created) {
              return outputApi.responseSuccess(201, true, 'Success create user', user, res)
            } else {
              return outputApi.responseError(409, {message: "Username already exist"}, res)
            }
          })
          .catch((err) => {
            return outputApi.responseError(400, {message: err}, res)
          })
      }

      
    })
  } catch (err) {
    return outputApi.responseError(500, 'Internal server error', res)
  }
}