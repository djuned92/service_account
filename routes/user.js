const express = require('express')
const router = express.Router()
const user = require('../controllers/userController')
const jwtMiddleware = require('../middleware/jwtMiddleware');

// get all user
router.get('/', jwtMiddleware, user.getAll)

// get user by id
router.get('/:id', jwtMiddleware, user.getById)

// create
router.post('/create',user.create)

module.exports = router;