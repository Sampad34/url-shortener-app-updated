/**
 * Simple short-code generator (base62-ish).
 * Not cryptographically secure but good enough for a shortener.
 */
function generateShortCode(length = 7) {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (err) {
    return false;
  }
}

/**
 * Helper: build the short URL (e.g. http://localhost:5000/r/:code)
 */
function shortUrlFor(code) {
  const apiBase = process.env.VITE_API_BASE_URL || "http://localhost:5000";
  return `${apiBase}/r/${code}`;
}

/**
 * Helper: copy text to clipboard
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    alert("Copied!");
  } catch {
    alert("Failed to copy");
  }
}

/**
 * Helper: format date nicely
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString(); // example: "9/16/2025, 8:35:12 PM"
}

module.exports = {
  generateShortCode,
  isValidUrl,
  shortUrlFor,
  copyToClipboard,
  formatDate,
};
