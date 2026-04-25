import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createShortUrl } from "../api/shortUrl.api.js";
import { copyToClipboard, shortUrlFor } from "../utils/helper.js";
import { QRCodeCanvas } from "qrcode.react";

export default function UrlForm({ onCreated }) {
  const [fullUrl, setFullUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);
  const [error, setError] = useState("");

  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      const payload = { fullUrl };
      if (customCode && showCustom) {
        payload.customCode = customCode;
      }
      
      const { data } = await createShortUrl(payload);
      setCreated(data.url);
      setFullUrl("");
      setCustomCode("");
      onCreated?.();
    } catch (err) {
      console.error("❌ Failed to shorten URL:", err);
      const message = err?.response?.data?.message || "Failed to shorten URL";
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full max-w-full overflow-hidden">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="url"
          required
          placeholder="https://example.com/long/link"
          value={fullUrl}
          onChange={(e) => setFullUrl(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        
        {showCustom && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
            <span className="text-sm text-gray-500 break-words sm:whitespace-nowrap">
              {shortUrlFor("")}
            </span>
            <input
              type="text"
              placeholder="custom-code"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.toLowerCase())}
              className="flex-1 min-w-0 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors cursor-pointer"
          >
            {loading ? "Shortening…" : "Shorten"}
          </button>
          <button
            type="button"
            onClick={() => setShowCustom(!showCustom)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            {showCustom ? "Cancel" : "Custom"}
          </button>
        </div>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>

      {created && (
        <div className="mt-4 p-3 border-l-4 border-indigo-300 bg-indigo-50 rounded overflow-hidden">
          <div className="text-gray-600 text-sm">Short URL</div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-1 gap-2">
            <a
              href={shortUrlFor(created.shortId)}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-700 font-medium hover:underline break-all text-sm"
            >
              {shortUrlFor(created.shortId)}
            </a>
            <button
              onClick={() => copyToClipboard(shortUrlFor(created.shortId))}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-100 cursor-pointer whitespace-nowrap"
            >
              Copy
            </button>
          </div>
          <div className="mt-3 flex justify-center sm:justify-start overflow-auto">
            <div className="flex-shrink-0">
              <QRCodeCanvas value={shortUrlFor(created.shortId)} size={128} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}