/* eslint-disable */

const bcryptjs = require('bcryptjs');
const UserService = require('../services/usersService');

class UserController {
  async getUser(req, res) {
    try {
      const user = await UserService.findUser(req.user.userId);
      return res.json({
        user: {
          _id: user._id,
          role: user.role,
          email: user.email,
          created_date: user.created_date,
        },
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword) {
        return res.status(400).json({ message: 'Please, enter your old password' });
      }
      if (!newPassword) {
        return res.status(400).json({ message: 'Please, enter a new password' });
      }
      const user = await UserService.findUser(req.user.userId);
      if (await bcryptjs.compare(String(oldPassword), String(user.password))) {
        user.password = await bcryptjs.hash(newPassword, 10);
        if (await UserService.saveUserData(res, user)) {
          return res.json({ message: 'Password changed successfully' });
        }
      }
      return res.status(400).json({ message: 'Old password is not correct' });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const deleteResult = await UserService.deleteUser(req.user.userId);
      if (deleteResult.deletedCount === 1) {
        return res.json({ message: 'Profile deleted successfully' });
      }
      return res.status(400).json({ message: 'No profile found' });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
}

module.exports = new UserController();
