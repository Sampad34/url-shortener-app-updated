import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { getMyUrls, deleteUrl as deleteShortUrl } from "../api/shortUrl.api.js";
import UrlForm from "../components/UrlForm.jsx";
import UserUrl from "../components/UserUrl.jsx";

export default function DashboardPage() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const loadUrls = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getMyUrls();

      // ✅ Always unwrap response consistently
      if (data?.success && Array.isArray(data.urls)) {
        setUrls(data.urls);
      } else {
        setUrls([]);
      }
    } catch (err) {
      console.error("❌ Failed to load URLs:", err);
      alert(err?.response?.data?.message || "Failed to load URLs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUrls();
  }, [loadUrls]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this short URL?")) return;
    try {
      const { data } = await deleteShortUrl(id);

      if (data?.success) {
        setUrls((prev) => prev.filter((u) => u._id !== id));
      } else {
        alert("Delete failed. Please try again.");
      }
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert(err?.response?.data?.message || "Delete failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Greeting + Create Form */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold">
            Hi, {user?.name || user?.email}
          </h2>
          <p className="text-sm text-gray-500">Create short links below</p>
          <div className="mt-4">
            <UrlForm onCreated={loadUrls} />
          </div>
        </div>

        {/* User URLs Section */}
        <div className="space-y-3">
          <h3 className="text-md font-medium">Your URLs</h3>

          {loading ? (
            <div className="p-6 bg-white rounded-2xl shadow text-center">
              Loading…
            </div>
          ) : urls.length > 0 ? (
            <div className="flex flex-col gap-3">
              {urls.map((url) => (
                <UserUrl key={url._id} url={url} onDeleted={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="p-6 bg-white rounded-2xl shadow text-center">
              No shortened URLs yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
