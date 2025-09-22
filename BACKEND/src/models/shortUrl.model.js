const mongoose = require("mongoose");

const shortUrlSchema = new mongoose.Schema(
  {
    fullUrl: {
      type: String,
      required: true,
    },
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    clicks: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError
const ShortUrl =
  mongoose.models.ShortUrl || mongoose.model("ShortUrl", shortUrlSchema);

module.exports = ShortUrl;
