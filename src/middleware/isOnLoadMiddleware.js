/* eslint-disable consistent-return */

const { getLoadTruck } = require('../services/trucksService');
const { userRoles } = require('../models/User');

const isOnLoadMiddleware = async (req, res, next) => {
  try {
    if (req.user.role === userRoles[1]) {
      const truckOnLoad = await getLoadTruck(req.user.userId);
      if (truckOnLoad) {
        return res.status(400).json({ message: 'You can not change your profile or trucks info while you are on a load' });
      }
    }
    next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = { isOnLoadMiddleware };
