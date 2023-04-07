/* eslint-disable consistent-return */

require('dotenv').config();

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(400).json({ message: 'Please, provide authorization header' });
  }

  const [, token] = authorization.split(' ');

  if (!token) {
    return res.status(400).json({ message: 'Please, include token to request' });
  }

  try {
    const tokenPayload = jwt.verify(token, process.env.SECRET_KEY);
    req.user = {
      userId: tokenPayload.userId,
      email: tokenPayload.email,
      role: tokenPayload.role,
    };
    next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = { authMiddleware };
