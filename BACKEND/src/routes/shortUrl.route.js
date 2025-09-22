// src/routes/shortUrl.route.js
const express = require("express");
const router = express.Router();

const {
  createShortUrl,
  getUserUrls,
  deleteUrl,
  redirectToOriginal,
  getQrCode,
} = require("../controller/shortUrl.controller");

const { requireAuth } = require("../middleware/auth.middleware");

// ---------- Protected Routes (Require Authentication) ----------
router.post("/", requireAuth, createShortUrl);      // Create new short URL
router.get("/me", requireAuth, getUserUrls);       // Get logged-in user's URLs
router.delete("/:id", requireAuth, deleteUrl);     // Delete a URL owned by the user

// ---------- Public Route ----------
router.get("/:code", redirectToOriginal);          // Redirect shortId → full URL
router.get("/:id/qr", getQrCode); // <-- New QR route

module.exports = router;
