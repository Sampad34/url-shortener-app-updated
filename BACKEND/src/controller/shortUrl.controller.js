const QRCode = require("qrcode");
const shortUrlDao = require("../dao/shortUrl.dao");
const { isValidUrl } = require("../utils/helper");
const shortUrlService = require("../services/shortUrl.service");
const analyticsService = require("../services/analytics.service");
const tryCatch = require("../utils/tryCatchWrapper");

// Create a new short URL
const createShortUrl = tryCatch(async (req, res) => {
  const { fullUrl, customCode } = req.body;

  if (!fullUrl || !isValidUrl(fullUrl)) {
    return res
      .status(400)
      .json({ success: false, message: "Valid fullUrl is required" });
  }

  // Create short URL record and get the generated shortId
  const newShort = await shortUrlService.createShortUrl({
    fullUrl,
    userId: req.user._id,
    customCode,
  });

  // Use BACKEND_URL from env
  const shortUrl = `${process.env.BACKEND_URL}/${newShort.shortId}`;

  res.status(201).json({
    success: true,
    message: "Short URL created",
    url: {
      _id: newShort._id,
      shortId: newShort.shortId,
      fullUrl: newShort.fullUrl,
      clicks: newShort.clicks || 0,
      createdAt: newShort.createdAt,
      shortUrl,
    },
  });
});

// Get current user’s URLs
const getUserUrls = tryCatch(async (req, res) => {
  const urls = await shortUrlDao.findAllByUser(req.user._id);
  res.json({ success: true, urls });
});

// Delete a short URL
const deleteUrl = tryCatch(async (req, res) => {
  const url = await shortUrlDao.deleteById(req.params.id, req.user._id);

  if (!url) {
    return res.status(404).json({ success: false, message: "URL not found" });
  }

  res.json({ success: true, message: "Deleted successfully" });
});

// Public redirect
const redirectToOriginal = tryCatch(async (req, res) => {
  const { code } = req.params;

  const record = await shortUrlService.resolveShortId(code);

  if (!record) {
    return res.status(404).send("Short URL not found");
  }

  //  Track analytics (NON-BLOCKING)
  analyticsService.trackEvent(req, code);

  return res.redirect(record.fullUrl);
});

// Generate QR Code for a short URL
const getQrCode = tryCatch(async (req, res) => {
  const { code } = req.params;
  const url = await shortUrlDao.findByShortId(code);

  if (!url) {
    return res
      .status(404)
      .json({ success: false, message: "Short URL not found" });
  }

  const shortLink = `${process.env.BACKEND_URL}/${url.shortId}`;

  try {
    const qrDataUrl = await QRCode.toDataURL(shortLink);
    res.json({ success: true, qr: qrDataUrl });
  } catch (err) {
    console.error("❌ QR generation failed:", err);
    res.status(500).json({ success: false, message: "QR generation failed" });
  }
});

module.exports = {
  createShortUrl,
  getUserUrls,
  deleteUrl,
  redirectToOriginal,
  getQrCode,
};
