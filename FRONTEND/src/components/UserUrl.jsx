import { useState } from "react";
import { shortUrlFor, formatDate, copyToClipboard } from "../utils/helper.js";
import { QRCodeCanvas } from "qrcode.react";
import { getUrlAnalytics } from "../api/shortUrl.api.js";

export default function UserUrl({ url, onDeleted }) {
  const [showQR, setShowQR] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  
  if (!url) return null;
  const shortLink = shortUrlFor(url.shortId);

  const handleFetchAnalytics = async () => {
    if (analytics) {
      setShowAnalytics(!showAnalytics);
      return;
    }
    
    setLoadingAnalytics(true);
    try {
      const { data } = await getUrlAnalytics(url.shortId);
      if (data?.success) {
        setAnalytics(data.data);
        setShowAnalytics(true);
      }
    } catch (err) {
      console.error("❌ Failed to fetch analytics:", err);
      alert("Failed to load analytics");
    } finally {
      setLoadingAnalytics(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl shadow-md flex flex-col gap-4 transition-transform hover:-translate-y-1 hover:shadow-lg">
      {/* URL Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <a
          href={url.fullUrl}
          target="_blank"
          rel="noreferrer"
          className="block text-sm sm:text-base text-gray-900 font-medium truncate hover:underline"
        >
          {url.fullUrl}
        </a>

        <div className="text-sm sm:text-base text-indigo-600 truncate">
          <a
            href={shortLink}
            target="_blank"
            rel="noreferrer"
            className="hover:text-indigo-800 hover:underline break-all"
          >
            {shortLink}
          </a>
        </div>

        <div className="text-xs sm:text-sm text-gray-500 mt-1">
          Clicks: <span className="font-semibold text-gray-700">{url.clicks ?? 0}</span> • {formatDate(url.createdAt)}
        </div>

        {/* Analytics Display */}
        {showAnalytics && analytics && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Analytics</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Total Clicks: <span className="font-bold">{analytics.totalClicks}</span></div>
              {analytics.countries && (
                <div>Countries: {[...new Set(analytics.countries)].join(", ")}</div>
              )}
              {analytics.devices && (
                <div>Devices: {[...new Set(analytics.devices)].join(", ")}</div>
              )}
            </div>
          </div>
        )}

        {/* QR Code Display */}
        {showQR && (
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
            <QRCodeCanvas value={shortLink} size={128} />
            <button
              onClick={() => {
                const canvas = document.querySelector(`canvas[data-shortid="${url.shortId}"]`);
                if (canvas) {
                  const link = document.createElement('a');
                  link.download = `qr-${url.shortId}.png`;
                  link.href = canvas.toDataURL();
                  link.click();
                }
              }}
              className="text-xs sm:text-sm text-blue-600 hover:underline"
            >
              Download QR
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => copyToClipboard(shortLink)}
          className="px-3 py-1 border border-gray-300 rounded-lg text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 cursor-pointer"
        >
          Copy
        </button>

        <button
          onClick={() => onDeleted?.(url._id)}
          className="px-3 py-1 bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs sm:text-sm hover:bg-red-200 cursor-pointer"
        >
          Delete
        </button>

        <button
          onClick={() => {
            setShowQR((prev) => !prev);
            setShowAnalytics(false);
          }}
          className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs sm:text-sm hover:bg-green-200 cursor-pointer"
        >
          {showQR ? "Hide QR" : "Show QR"}
        </button>

        <button
          onClick={handleFetchAnalytics}
          disabled={loadingAnalytics}
          className="px-3 py-1 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs sm:text-sm hover:bg-blue-200 cursor-pointer disabled:opacity-50"
        >
          {loadingAnalytics ? "Loading..." : (showAnalytics ? "Hide Stats" : "Show Stats")}
        </button>
      </div>
    </div>
  );
}