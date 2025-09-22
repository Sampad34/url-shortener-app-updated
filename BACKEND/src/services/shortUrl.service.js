// src/services/shorturl.service.js
const shortUrlDao = require('../dao/shortUrl.dao');
const { generateShortCode, isValidUrl } = require('../utils/helper');

const DEFAULT_CODE_LENGTH = 6;
const MAX_ATTEMPTS = 5;

/**
 * Create a short url record. Uses the DAO methods that operate on fields
 * named to match the Mongoose model (fullUrl, shortId, user).
 */
async function createShortUrl({ fullUrl, userId, meta = {} }) {
  if (!isValidUrl(fullUrl)) {
    const err = new Error('Invalid URL. Include protocol (http:// or https://)');
    err.status = 400;
    throw err;
  }

  // create unique shortId (attempts to avoid collisions)
  let attempts = 0;
  let shortId;
  while (attempts < MAX_ATTEMPTS) {
    shortId = generateShortCode(DEFAULT_CODE_LENGTH + Math.floor(Math.random() * 2));
    const existing = await shortUrlDao.existsByShortId(shortId);
    if (!existing) break;
    attempts += 1;
  }
  if (attempts >= MAX_ATTEMPTS) {
    const err = new Error('Failed to generate a unique short code, please try again');
    err.status = 500;
    throw err;
  }

  const payload = {
    fullUrl,
    shortId,
    user: userId,
    meta,
  };

  return shortUrlDao.createShortUrl(payload);
}

async function resolveShortId(shortId) {
  const doc = await shortUrlDao.findByShortId(shortId);
  if (!doc) return null;
  await shortUrlDao.incrementClicks(doc._id);
  return doc;
}

async function getUserUrls(userId) {
  return shortUrlDao.findAllByUser(userId);
}

async function deleteUrl(id, userId) {
  return shortUrlDao.deleteById(id, userId);
}

module.exports = {
  createShortUrl,
  resolveShortId,
  getUserUrls,
  deleteUrl,
};
