// src/routes/user.route.js
const express = require("express");
const router = express.Router();

const { getProfile, getUserUrls } = require("../controller/user.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const tryCatch = require("../utils/tryCatchWrapper");

// ---------- User Routes ----------
router.get("/profile", requireAuth, tryCatch(getProfile)); // Get logged-in user's profile
router.get("/urls", requireAuth, tryCatch(getUserUrls)); // Get logged-in user's URLs

module.exports = router;
