const express = require('express')
const {
  signinUser,
  createUser,
  updateUser,
  validateTokenUser,
  getUserById
} = require('../controllers/user.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const router = express.Router()

router.use(express.json());
router.get('/validateToken', authMiddleware, validateTokenUser)
router.post('/login', signinUser)
router.post('/register', createUser)
router.put('/:id',authMiddleware, updateUser)
router.get('/:id', getUserById)
module.exports = router
