// src/models/user.model.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: "" },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: { type: String }, // not required for Google OAuth users
  createdAt: { type: Date, default: Date.now },
  googleId: { type: String, index: true, sparse: true },
  authProvider: { type: String, enum: ["local", "google"], default: "local" },
});

module.exports = mongoose.model("User", userSchema);
