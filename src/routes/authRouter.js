const express = require('express');

const router = express.Router();
const { registerUser, loginUser, forgotPassword } = require('../services/authService');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot_password', forgotPassword);

module.exports = {
  authRouter: router,
};
