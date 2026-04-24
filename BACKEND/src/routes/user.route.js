// src/routes/user.route.js
const express = require("express");
const router = express.Router();

const { getProfile } = require("../controller/user.controller");
const { requireAuth } = require("../middleware/auth.middleware");

// ---------- User Routes ----------
router.get("/profile", requireAuth, getProfile); // Get logged-in user's profile

module.exports = router;
