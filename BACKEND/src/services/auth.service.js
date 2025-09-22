const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/config');
const userDao = require('../dao/user.dao');

const SALT_ROUNDS = 10;
const TOKEN_EXPIRES_IN = jwtExpiresIn || '7d';

async function register({ name, email, password }) {
  const existing = await userDao.findByEmail(email);
  if (existing) {
    const err = new Error('Email already in use');
    err.status = 400;
    throw err;
  }

  if (!password) {
    const err = new Error('Password is required for local registration');
    err.status = 400;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await userDao.createUser({
    name,
    email,
    passwordHash,
    authProvider: 'local',
  });

  const token = generateToken(user);
  return { user: { _id: user._id, email: user.email, name: user.name }, token };
}

async function login({ email, password }) {
  const user = await userDao.findByEmail(email);
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  if (user.authProvider === 'google') {
    const err = new Error('Use Google login instead');
    err.status = 400;
    throw err;
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const token = generateToken(user);
  return { user: { _id: user._id, email: user.email, name: user.name }, token };
}

function generateToken(user) {
  return jwt.sign(
    { sub: user._id, email: user.email },
    jwtSecret,
    { expiresIn: TOKEN_EXPIRES_IN }
  );
}

function verifyToken(token) {
  return jwt.verify(token, jwtSecret);
}

module.exports = {
  register,
  login,
  generateToken,
  verifyToken,
};
