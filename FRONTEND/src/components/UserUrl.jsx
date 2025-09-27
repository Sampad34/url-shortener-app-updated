import { useState } from "react";
import { shortUrlFor, formatDate, copyToClipboard } from "../utils/helper.js";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";

export default function UserUrl({ url, onDeleted }) {
  if (!url) return null;

  const [showQR, setShowQR] = useState(false);
  const [qrDownloadUrl, setQrDownloadUrl] = useState(null);

  const shortLink = shortUrlFor(url.shortId);

  const handleFetchQr = async () => {
    try {
      const { data } = await axios.get(`/api/urls/${url.shortId}/qr`);
      if (data?.success) {
        setQrDownloadUrl(data.qr);
      }
    } catch (err) {
      console.error("❌ Failed to fetch backend QR:", err);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-transform hover:-translate-y-1 hover:shadow-lg">
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
          Clicks:{" "}
          <span className="font-semibold text-gray-700">{url.clicks ?? 0}</span>{" "}
          • {formatDate(url.createdAt)}
        </div>

        {/* QR Code Display */}
        {showQR && (
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
            <QRCodeCanvas value={shortLink} size={128} />
            {qrDownloadUrl && (
              <a
                href={qrDownloadUrl}
                download={`qr-${url.shortId}.png`}
                className="text-xs sm:text-sm text-blue-600 hover:underline"
              >
                Download QR
              </a>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mt-2 sm:mt-0 shrink-0">
        <button
          onClick={() => shortLink && copyToClipboard(shortLink)}
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
            handleFetchQr();
          }}
          className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs sm:text-sm hover:bg-green-200 cursor-pointer"
        >
          {showQR ? "Hide QR" : "Show QR"}
        </button>
      </div>
    </div>
  );
}
