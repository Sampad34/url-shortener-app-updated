// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("./src/config/passport");

const connectMongo = require("./src/config/mongo.config");
const { port } = require("./src/config/config");
const errorHandler = require("./src/utils/errorHandler");

// Routes
const authRoutes = require("./src/routes/auth.route");
const userRoutes = require("./src/routes/user.route");
const shortUrlRoutes = require("./src/routes/shortUrl.route");
const { redirectToOriginal } = require("./src/controller/shortUrl.controller");

const app = express();

// -----------------------------
// Middleware
// -----------------------------
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// -----------------------------
// API Routes
// -----------------------------
app.use("/api/auth", authRoutes);     // → /api/auth/register, /api/auth/login
app.use("/api/users", userRoutes);    // → /api/users/profile, /api/users/urls
app.use("/api/urls", shortUrlRoutes); // → /api/urls/me, /api/urls/:id

// Public redirect route (no auth)
app.get("/r/:code", redirectToOriginal);

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// Root welcome
app.get("/", (req, res) => {
  res.send("🚀 URL Shortener API is running");
});

// -----------------------------
// Global Error Handler
// -----------------------------
app.use(errorHandler);

// -----------------------------
// Start Server
// -----------------------------
async function start() {
  try {
    await connectMongo();
    app.listen(port, () => {
      console.log(`✅ MongoDB connected`);
      console.log(`🚀 Server listening at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server", err);
    process.exit(1);
  }
}

start();

module.exports = app;
