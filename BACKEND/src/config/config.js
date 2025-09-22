// src/config/config.js
const dotenv = require("dotenv");
const path = require("path");

// Explicitly load the .env file from project root (backend/.env)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Helper: validate required env variables
function getEnvVar(key, required = true, fallback = undefined) {
  const value = process.env[key] || fallback;
  if (required && !value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value;
}

module.exports = {
  port: getEnvVar("PORT", false, 5000),
  mongodbUri: getEnvVar("MONGODB_URI"),
  jwtSecret: getEnvVar("JWT_SECRET"),
  jwtExpiresIn: getEnvVar("JWT_EXPIRES_IN", false, "1d"),
  cookieSecret: getEnvVar("COOKIE_SECRET"),
};
