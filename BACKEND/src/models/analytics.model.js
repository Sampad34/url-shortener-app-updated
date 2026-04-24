const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    index: true,
  },
  ip: String,
  country: String,
  device: String,
  referrer: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// optional: TTL (auto delete after X days)
analyticsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 }); // 90 days

module.exports =
  mongoose.models.Analytics ||
  mongoose.model("Analytics", analyticsSchema);