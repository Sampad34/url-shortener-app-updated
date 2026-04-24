const geoip = require("geoip-lite");
const UAParser = require("ua-parser-js");
const analyticsDao = require("../dao/analytics.dao");

//✅ Ensure geoip database is loaded
try {
  geoip.startWatchingDataUpdate();
} catch (err) {
  console.warn("⚠️ GeoIP database not loaded:", err.message);
}

async function trackEvent(req, shortId) {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      "";

    let country = "Unknown";
    try {
      const geo = geoip.lookup(ip);
      country = geo?.country || "Unknown";
    } catch (geoErr) {
      console.warn(
        "⚠️ Error occurred while looking up geo location:",
        geoErr.message,
      );
    }

    const ua = new UAParser(req.headers["user-agent"]);
    const deviceType = ua.getDevice().type || "desktop";

    const referrer = req.headers.referer || "direct";

    await analyticsDao.createEvent({
      shortId,
      ip,
      country,
      device: deviceType,
      referrer,
    });
  } catch (err) {
    // never break redirect flow
    console.error("Analytics error:", err.message);
  }
}

module.exports = {
  trackEvent,
};
