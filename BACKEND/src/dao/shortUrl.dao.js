const ShortUrl = require("../models/shortUrl.model");

// Create a new short URL
async function createShortUrl(payload) {
  const doc = new ShortUrl({
    ...payload,
    clicks: 0, // ensure default clicks
  });
  return await doc.save();
}

// Find short URL by shortId (with user populated)
async function findByShortId(shortId) {
  return ShortUrl.findOne({ shortId }).populate("user", "email name").exec();
}

// Increment click count
async function incrementClicks(id) {
  return ShortUrl.findByIdAndUpdate(
    id,
    { $inc: { clicks: 1 } },
    { new: true }
  ).exec();
}

// Find all URLs for a user
async function findAllByUser(userId) {
  return ShortUrl.find({ user: userId })
    .sort({ createdAt: -1 })
    .select("_id shortId fullUrl clicks createdAt") // return necessary fields only
    .exec();
}

// Delete URL by id for a user
async function deleteById(id, userId) {
  return ShortUrl.findOneAndDelete({ _id: id, user: userId }).exec();
}

// Check if shortId exists
async function existsByShortId(shortId) {
  return ShortUrl.findOne({ shortId }).exec();
}

module.exports = {
  createShortUrl,
  findByShortId,
  incrementClicks,
  findAllByUser,
  deleteById,
  existsByShortId,
};
