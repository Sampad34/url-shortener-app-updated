/**
 * Simple short-code generator (base62-ish).
 */
export function generateShortCode(length = 7) {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (err) {
    console.error("URL validation error:", err);
    return false;
  }
}

/**
 * Helper: build the short URL
 * Now uses the backend URL correctly
 */
export function shortUrlFor(code) {
  const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  return `${backendUrl}/${code}`;
}

/**
 * Helper: copy text to clipboard with better UX
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    // Optional: show a toast instead of alert
    const toast = document.createElement('div');
    toast.textContent = 'Copied to clipboard!';
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50 animate-fade-out';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  } catch {
    alert("Failed to copy. Please copy manually.");
  }
}

/**
 * Helper: format date nicely
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}