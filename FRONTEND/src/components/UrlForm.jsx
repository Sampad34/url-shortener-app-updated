import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createShortUrl } from "../api/shortUrl.api.js";
import { copyToClipboard, shortUrlFor } from "../utils/helper.js";
import { QRCodeCanvas } from "qrcode.react";

export default function UrlForm({ onCreated }) {
  const [fullUrl, setFullUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      const { data } = await createShortUrl({ fullUrl });
      setCreated(data.url);
      setFullUrl("");
      onCreated?.();
    } catch (err) {
      console.error("❌ Failed to shorten URL:", err);
      alert(err?.response?.data?.message || "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="url"
          required
          placeholder="https://example.com/long/link"
          value={fullUrl}
          onChange={(e) => setFullUrl(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 sm:py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors mt-2 sm:mt-0 cursor-pointer"
        >
          {loading ? "Shortening…" : "Shorten"}
        </button>
      </form>

      {created && (
        <div className="mt-3 p-3 border-l-4 border-indigo-300 bg-indigo-50 rounded text-sm sm:text-base">
          <div className="text-gray-600">Short URL</div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-1 gap-2 sm:gap-0">
            <a
              href={shortUrlFor(created.shortId)}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-700 font-medium hover:underline break-all"
            >
              {shortUrlFor(created.shortId)}
            </a>
            <button
              onClick={() => copyToClipboard(shortUrlFor(created.shortId))}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
            >
              Copy
            </button>
          </div>
          <div className="mt-2 flex justify-center sm:justify-start">
            <QRCodeCanvas value={shortUrlFor(created.shortId)} size={128} />
          </div>
        </div>
      )}
    </div>
  );
}
