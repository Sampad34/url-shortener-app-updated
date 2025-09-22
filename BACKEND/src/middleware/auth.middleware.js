// src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');
const userDao = require('../dao/user.dao');

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const err = new Error('Authentication token missing');
      err.status = 401;
      return next(err);
    }
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, jwtSecret);
    // Attach user info (lightweight)
    const user = await userDao.findById(payload.sub);
    if (!user) {
      const err = new Error('User not found');
      err.status = 401;
      return next(err);
    }
    req.user = { _id: user._id, email: user.email, name: user.name };
    next();
  } catch (err) {
    err.status = err.status || 401;
    next(err);
  }
}

module.exports = {
  requireAuth,
};
