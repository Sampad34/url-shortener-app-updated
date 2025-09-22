// src/routes/auth.route.js
const express = require("express");
const router = express.Router();

const {
  register,
  login,
  profile,
  googleCallback,
} = require("../controller/auth.controller");

const { requireAuth } = require("../middleware/auth.middleware");
const tryCatch = require("../utils/tryCatchWrapper");
const passport = require("../config/passport");

// ---------- Auth Routes ----------
router.post("/register", tryCatch(register)); // Register new user
router.post("/login", tryCatch(login)); // Login user
router.get("/profile", requireAuth, tryCatch(profile)); // Get user profile

// ---------- Google OAuth Routes ----------
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google`,
  }),
  tryCatch(googleCallback)
);

module.exports = router;
