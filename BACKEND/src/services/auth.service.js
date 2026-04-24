const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  jwtSecret,
  jwtExpiresIn,
  refreshTokenExpiresIn,
  refreshTokenSecret,
} = require("../config/config");
const userDao = require("../dao/user.dao");
const redis = require("../config/redis.config");

const SALT_ROUNDS = 10;
const TOKEN_EXPIRES_IN = jwtExpiresIn || "7d";

function generateRefreshToken(user) {
  return jwt.sign({ sub: user._id }, refreshTokenSecret, {
    expiresIn: refreshTokenExpiresIn,
  });
}

async function storeRefreshToken(token, userId) {
  const key = `refresh:${token}`;
  const ttl = 7 * 24 * 60 * 60; // 7 days (sync with env)

  await redis.set(key, userId.toString(), "EX", ttl);
}

async function verifyRefreshToken(token) {
  const payload = jwt.verify(token, refreshTokenSecret);

  const exists = await redis.get(`refresh:${token}`);
  if (!exists) {
    throw new Error("Invalid refresh token");
  }

  return payload;
}

async function register({ name, email, password }) {
  const existing = await userDao.findByEmail(email);
  if (existing) {
    const err = new Error("Email already in use");
    err.status = 400;
    throw err;
  }

  if (!password) {
    const err = new Error("Password is required for local registration");
    err.status = 400;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await userDao.createUser({
    name,
    email,
    passwordHash,
    authProvider: "local",
  });

  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  await storeRefreshToken(refreshToken, user._id);
  return {
    user: { _id: user._id, email: user.email, name: user.name },
    accessToken,
    refreshToken,
    refreshtokenExpiresIn: refreshTokenExpiresIn,
  };
}

async function login({ email, password }) {
  const user = await userDao.findByEmail(email);
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  if (user.authProvider === "google") {
    const err = new Error("Use Google login instead");
    err.status = 400;
    throw err;
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  await storeRefreshToken(refreshToken, user._id);
  return {
    user: { _id: user._id, email: user.email, name: user.name },
    accessToken,
    refreshToken,
    refreshTokenExpiresIn: refreshTokenExpiresIn,
  };
}

function generateToken(user) {
  return jwt.sign(
    { sub: user._id, email: user.email, role: user.role || "user" },
    jwtSecret,
    { expiresIn: TOKEN_EXPIRES_IN },
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
  generateRefreshToken,
  verifyRefreshToken,
  storeRefreshToken,
};
