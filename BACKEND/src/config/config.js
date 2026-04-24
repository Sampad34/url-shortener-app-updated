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
  port: Number(getEnvVar("PORT", false, 5000)),
  mongodbUri: getEnvVar("MONGODB_URI"),
  jwtSecret: getEnvVar("JWT_SECRET"),
  jwtExpiresIn: getEnvVar("JWT_EXPIRES_IN", false, "1d"),
  cookieSecret: getEnvVar("COOKIE_SECRET"),

  // Additional env vars
  googleClientId: getEnvVar("GOOGLE_CLIENT_ID", false),
  googleClientSecret: getEnvVar("GOOGLE_CLIENT_SECRET", false),
  googleCallbackUrl: getEnvVar("GOOGLE_CALLBACK_URL", false),
  frontendUrl: getEnvVar("FRONTEND_URL", false, "http://localhost:5173"),
  backendUrl: getEnvVar("BACKEND_URL", false, "http://localhost:5000"),
  redisUrl: getEnvVar("REDIS_URL", false),
  refreshTokenSecret: getEnvVar("REFRESH_TOKEN_SECRET", false),
  refreshTokenExpiresIn: getEnvVar("REFRESH_TOKEN_EXPIRES_IN", false, "7d"),
};
