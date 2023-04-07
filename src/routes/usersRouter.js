const express = require('express');

const router = express.Router();
const userController = require('../controllers/usersController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { isOnLoadMiddleware } = require('../middleware/isOnLoadMiddleware');

router.get('/me', authMiddleware, userController.getUser);
router.patch('/me/password', authMiddleware, isOnLoadMiddleware, userController.changePassword);
router.delete('/me', authMiddleware, isOnLoadMiddleware, userController.deleteUser);

module.exports = {
  usersRouter: router,
};
