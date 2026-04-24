// src/routes/shortUrl.route.js
const express = require("express");
const router = express.Router();

const {
  createShortUrl,
  getUserUrls,
  deleteUrl,

  getQrCode,
} = require("../controller/shortUrl.controller");

const { requireAuth } = require("../middleware/auth.middleware");
const createRateLimiter = require("../middleware/rateLimit.middleware"); // ADDED

// ---------- Protected Routes (Require Authentication) ----------
const createUrlLimiter = createRateLimiter({
  limit: 20,
  windowSec: 60, // 20 URLs/min
  prefix: "create_url",
});

// ---------- Protected Routes (Require Authentication) ----------
router.post("/", requireAuth, createUrlLimiter, createShortUrl); // Create new short URL
router.get("/me", requireAuth, getUserUrls); // Get logged-in user's URLs
router.delete("/:id", requireAuth, deleteUrl); // Delete a URL owned by the user

// ---------- Public Route ----------
router.get("/:code/qr", getQrCode); // <-- New QR route

module.exports = router;
