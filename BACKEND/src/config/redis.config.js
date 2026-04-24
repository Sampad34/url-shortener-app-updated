const Redis = require("ioredis");

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.warn(
    "⚠️ REDIS_URL not set. Rate limiting and caching will be disabled.",
  );
}

const redis = new Redis(redisUrl || "redis://localhost:6379", {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  retryStrategy(times) {
    if (times >= 5) {
      console.error("❌ Redis connection failed after multiple attempts.");
      return null; // Stop retrying after 5 attempts
    }
    return Math.min(times * 100, 3000);
  },
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});

module.exports = redis;
