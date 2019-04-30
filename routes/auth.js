var express = require('express')
var router = express.Router()
var auth = require('../controllers/authController')

router.post('/login', auth.login)
// router.post('/logout', auth.logout)
router.get('/decode', auth.decodeJWT)
module.exports = router