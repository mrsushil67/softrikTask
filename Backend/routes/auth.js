const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// register
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Provide valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  ],
  register
);

// login
router.post('/login', login);

module.exports = router;
