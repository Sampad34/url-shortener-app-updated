// src/controller/auth.controller.js
const authService = require("../services/auth.service");
const userDao= require("../dao/user.dao");
const tryCatch = require("../utils/tryCatchWrapper");

const register = tryCatch(async (req, res) => {
  const { name = "", email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password required" });
  }
  const result = await authService.register({ name, email, password });
  res.status(201).json({ success: true, ...result });
});

const login = tryCatch(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password required" });
  }
  const result = await authService.login({ email, password });
  res.json({ success: true, ...result });
});




const googleCallback = tryCatch(async (req, res) => {
  const user = req.user; // set by Passport

  // ✅ Centralized token generator
  const token = authService.generateToken(user);

  // ✅ Frontend URL from env variable (with trailing slash removed)
  const frontendUrl = (process.env.FRONTEND_URL || "").replace(/\/+$/, "");
  if (!frontendUrl) {
    throw new Error("FRONTEND_URL not configured");
  }

  res.redirect(
    `${frontendUrl}/oauth-success?token=${token}&name=${encodeURIComponent(
      user.name,
    )}&email=${encodeURIComponent(user.email)}`,
  );
});



const refreshTokenHandler = tryCatch(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ success: false, message: "Refresh token required" });
  }

  const payload = await authService.verifyRefreshToken(refreshToken);

  const user = await userDao.findById(payload.sub);  // Assuming payload.sub contains user ID

  const newAccessToken = authService.generateToken(user);

  res.json({
    success: true,
    accessToken: newAccessToken,
  });
});


const logout = tryCatch(async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    const redis = require("../config/redis.config");
    await redis.del(`refresh:${refreshToken}`);
  }

  res.json({ success: true, message: "Logged out successfully" });
});

module.exports = {
  register,
  login,
  refreshTokenHandler,
  logout,
  googleCallback,
};
