// src/routes/user.route.js
const express = require("express");
const router = express.Router();

const { getProfile, getUserUrls } = require("../controller/user.controller");
const { requireAuth } = require("../middleware/auth.middleware");

// ---------- User Routes ----------
router.get("/profile", requireAuth, getProfile);   // Get logged-in user's profile
router.get("/urls", requireAuth, getUserUrls);     // Get logged-in user's URLs

module.exports = router;
