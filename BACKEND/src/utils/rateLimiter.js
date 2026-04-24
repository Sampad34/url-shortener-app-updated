const redis = require("../config/redis.config");

/**
 * Sliding Window Rate Limiter
 */
async function rateLimiter(key, limit, windowSec) {
  try {
    // Check if Redis is available
    if (!redis || redis.status !== "ready") {
      console.warn("⚠️ Redis not available, rate limiting disabled");
      return true; // Allow request if Redis is down
    }

    const now = Date.now();
    const windowStart = now - windowSec * 1000;

    // Remove old requests
    await redis.zremrangebyscore(key, 0, windowStart);

    // Count current requests
    const count = await redis.zcard(key);

    if (count >= limit) {
      return false;
    }

    // Add current request
    await redis.zadd(key, now, `${now}-${Math.random()}`);

    // Set expiry
    await redis.expire(key, windowSec);
    return true;
  } catch (err) {
    console.error("Rate limiter error:", err.message);
    return true; // ✅ Allow request on error (fail open)
  }
}

module.exports = rateLimiter;
