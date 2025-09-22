const QRCode = require("qrcode");
const shortUrlDao = require("../dao/shortUrl.dao");
const { generateShortCode, isValidUrl,shortUrlFor } = require("../utils/helper");
const tryCatch = require("../utils/tryCatchWrapper");

// Create a new short URL
const createShortUrl = tryCatch(async (req, res) => {
  const { fullUrl } = req.body;

  if (!fullUrl || !isValidUrl(fullUrl)) {
    return res.status(400).json({ success: false, message: "Valid fullUrl is required" });
  }

  // Generate unique shortId
  let shortId;
  while (true) {
    shortId = generateShortCode(7);
    const exists = await shortUrlDao.existsByShortId(shortId);
    if (!exists) break;
  }

  const newShort = await shortUrlDao.createShortUrl({
    user: req.user._id,
    fullUrl,
    shortId,
  });

  // Use FRONTEND_URL from env
  const shortUrl = `${process.env.FRONTEND_URL}/r/${newShort.shortId}`;

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
  const record = await shortUrlDao.findByShortId(code);

  if (!record) {
    return res.status(404).send("Short URL not found");
  }

  // Increment clicks
  await shortUrlDao.incrementClicks(record._id);

  return res.redirect(record.fullUrl);
});





// Generate QR Code for a short URL
const getQrCode = tryCatch(async (req, res) => {
  const { id } = req.params;
  const url = await shortUrlDao.findByShortId(id);

  if (!url) {
    return res.status(404).json({ success: false, message: "Short URL not found" });
  }

  const shortLink = `${process.env.FRONTEND_URL}/r/${url.shortId}`;

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
