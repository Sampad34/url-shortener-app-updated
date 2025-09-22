// src/controller/auth.controller.js
const authService = require("../services/auth.service");
const userDao = require("../dao/user.dao");
const tryCatch = require("../utils/tryCatchWrapper");

const register = tryCatch(async (req, res) => {
  const { name = "", email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }
  const result = await authService.register({ name, email, password });
  res.status(201).json({ success: true, ...result });
});

const login = tryCatch(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }
  const result = await authService.login({ email, password });
  res.json({ success: true, ...result });
});

const profile = tryCatch(async (req, res) => {
  const userId = req.user && req.user._id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  const user = await userDao.findById(userId);
  res.json({ success: true, user });
});

const googleCallback = tryCatch(async (req, res) => {
  const user = req.user; // set by Passport

  // ✅ Centralized token generator
  const token = authService.generateToken(user);

  // Redirect back to frontend with token + user info
  const frontendUrl = process.env.FRONTEND_URL ;
  res.redirect(
    `${frontendUrl}/oauth-success?token=${token}&name=${encodeURIComponent(
      user.name
    )}&email=${encodeURIComponent(user.email)}`
  );
});

module.exports = {
  register,
  login,
  profile,
  googleCallback,
};
