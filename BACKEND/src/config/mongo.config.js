const mongoose = require("mongoose");
const { mongodbUri } = require("./config");

async function connectMongo() {
  try {
    if (!mongodbUri) {
      throw new Error("❌ Missing MONGODB_URI in environment");
    }

    mongoose.set("strictQuery", true);

    await mongoose.connect(mongodbUri, {
      maxPoolSize: 10, // better connection pooling
      serverSelectionTimeoutMS: 5000, // fail fast if DB is unreachable
    });

    console.log("✅ MongoDB connected successfully");

    // 🔹 Try to drop any old/wrong index if present
    await dropOldIndex();
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Exit process if DB connection fails
  }
}

async function dropOldIndex() {
  try {
    const conn = mongoose.connection;

    // Check if collection exists
    const collections = await conn.db.listCollections({ name: "shorturls" }).toArray();
    if (collections.length === 0) {
      console.log("⚠️ No shorturls collection found, skipping index drop");
      return;
    }

    // In earlier code some indexes used different names (shortCode_1 etc).
    // Try to drop the likely legacy names but ignore failures.
    const possibleIndexNames = ["shortCode_1", "shortId_1", "shortid_1", "shortID_1"];

    for (const idxName of possibleIndexNames) {
      try {
        await conn.collection("shorturls").dropIndex(idxName);
        console.log(`✅ Dropped old index ${idxName}`);
      } catch (err) {
        // ignore index not found or other non-fatal errors
        // but log debug message
        // Some drivers throw when index doesn't exist — that's okay.
        // console.debug(`Index ${idxName} not found or could not be dropped: ${err.message}`);
      }
    }
  } catch (err) {
    console.error("⚠️ Index drop error (ignore if already gone):", err.message);
  }
}

module.exports = connectMongo;
