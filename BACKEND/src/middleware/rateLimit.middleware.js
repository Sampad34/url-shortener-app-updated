const rateLimiter = require("../utils/rateLimiter");

function createRateLimiter({ limit, windowSec, prefix }) {
  return async (req, res, next) => {
    try {
      const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress;

      const userId = req.user?._id;

      const key = userId
        ? `${prefix}:user:${userId}`
        : `${prefix}:ip:${ip}`;

      const allowed = await rateLimiter(key, limit, windowSec);

      if (!allowed) {
        return res.status(429).json({
          success: false,
          message: "Too many requests. Try again later.",
        });
      }

      next();
    } catch (err) {
      console.error("Rate limiter error:", err.message);
      next(); // don't block request if Redis fails
    }
  };
}

module.exports = createRateLimiter;