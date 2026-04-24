// src/routes/auth.route.js
const express = require("express");
const router = express.Router();

const {
  register,
  login,
  refreshTokenHandler,
  googleCallback,
  logout,
} = require("../controller/auth.controller");

const passport = require("../config/passport");
const createRateLimiter = require("../middleware/rateLimit.middleware");

const loginLimiter = createRateLimiter({
  limit: 5,
  windowSec: 60, // 5 attempts per minute
  prefix: "login",
});

// ---------- Auth Routes ----------

const registerLimiter = createRateLimiter({
  limit: 3,
  windowSec: 60,
  prefix: "register",
});

router.post("/register", registerLimiter, register); // Register new user (with rate limit)

router.post("/login", loginLimiter, login); // Login user
router.post("/refresh", refreshTokenHandler); // Refresh access token
router.post("/logout", logout); // Logout user (revoke refresh token)

// ---------- Google OAuth Routes ----------
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/auth?error=google`,
  }),
  googleCallback,
);

module.exports = router;
