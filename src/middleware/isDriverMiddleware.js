/* eslint-disable consistent-return */

const { userRoles } = require('../models/User');

const isDriverMiddleware = (req, res, next) => {
  try {
    const { role } = req.user;
    if (role !== userRoles[1]) {
      return res.status(400).json({ message: 'You can not interact with trucks, you are not a driver' });
    }
    next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = { isDriverMiddleware };
