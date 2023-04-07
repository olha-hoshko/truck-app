/* eslint-disable consistent-return */

const { userRoles } = require('../models/User');

const isShipperMiddleware = (req, res, next) => {
  try {
    const { role } = req.user;
    if (role !== userRoles[0]) {
      return res.status(400).json({ message: 'You can not interact with loads, you are not a shipper' });
    }
    next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = { isShipperMiddleware };
