// src/services/shorturl.service.js
const shortUrlDao = require("../dao/shortUrl.dao");
const { generateShortCode, isValidUrl,isValidCustomCode,isReservedCode } = require("../utils/helper");

const redis = require("../config/redis.config");

const CACHE_PREFIX = "short:";
const CACHE_TTL = 60 * 60; // 1 hour

// const DEFAULT_CODE_LENGTH = 6;
// const MAX_ATTEMPTS = 5;


async function createShortUrl({ fullUrl, userId, customCode = null, meta = {} }) {
  if (!isValidUrl(fullUrl)) {
    const err = new Error(
      "Invalid URL. Include protocol (http:// or https://)",
    );
    err.status = 400;
    throw err;
  }

 

  let shortId;

  // 🔥 CASE 1: Custom Code
  if (customCode) {
    if (!isValidCustomCode(customCode)) {
      const err = new Error(
        "Custom code must be 4-20 chars (letters, numbers, - or _)",
      );
      err.status = 400;
      throw err;
    }

    if (isReservedCode(customCode)) {
      const err = new Error("This custom code is reserved");
      err.status = 400;
      throw err;
    }

    const exists = await shortUrlDao.existsByShortId(customCode);
    if (exists) {
      const err = new Error("Custom code already in use");
      err.status = 409;
      throw err;
    }

    shortId = customCode;
  } else {
    // 🔥 CASE 2: Auto-generated
    let attempts = 0;
    while (attempts < MAX_ATTEMPTS) {
      shortId = generateShortCode(6 + Math.floor(Math.random() * 2));
      const exists = await shortUrlDao.existsByShortId(shortId);
      if (!exists) break;
      attempts++;
    }
    if (attempts >= MAX_ATTEMPTS) {
      throw new Error("Failed to generate unique short code");
    }
  }

  const payload = {
    fullUrl,
    shortId,
    user: userId,
    meta,
  };

  return shortUrlDao.createShortUrl(payload);
}

const MAX_ATTEMPTS = 5;

async function resolveShortId(shortId) {
  const cacheKey = `${CACHE_PREFIX}${shortId}`;

  // 🔥 1. Check Redis
  const cached = await redis.get(cacheKey);
  if (cached) {
    const data = JSON.parse(cached);

    // async increment (don't block redirect)
    shortUrlDao.incrementClicks(data._id).catch(() => {});

    return data;
  }

  // 🔥 2. DB fallback
  const doc = await shortUrlDao.findByShortId(shortId);
  if (!doc) return null;

  // 🔥 3. Cache it
  await redis.set(cacheKey, JSON.stringify(doc), "EX", CACHE_TTL);

  // 🔥 4. Increment clicks
  await shortUrlDao.incrementClicks(doc._id);

  return doc;
}

async function getUserUrls(userId) {
  return shortUrlDao.findAllByUser(userId);
}

async function deleteUrl(id, userId) {
  const url = await shortUrlDao.deleteById(id, userId);

  if (url) {
    const redis = require("../config/redis.config");
    await redis.del(`short:${url.shortId}`);
  }

  return url;
}

module.exports = {
  createShortUrl,
  resolveShortId,
  getUserUrls,
  deleteUrl,
};
