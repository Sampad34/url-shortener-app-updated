import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { getMyUrls, deleteUrl as deleteShortUrl } from "../api/shortUrl.api.js";
import UrlForm from "../components/UrlForm.jsx";
import UserUrl from "../components/UserUrl.jsx";

export default function DashboardPage() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalClicks: 0, totalUrls: 0 });

  const user = useSelector((state) => state.auth.user);

  const loadUrls = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getMyUrls();

      if (data?.success && Array.isArray(data.urls)) {
        setUrls(data.urls);
        const totalClicks = data.urls.reduce((sum, url) => sum + (url.clicks || 0), 0);
        setStats({ totalClicks, totalUrls: data.urls.length });
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
        const newTotalClicks = urls
          .filter((u) => u._id !== id)
          .reduce((sum, u) => sum + (u.clicks || 0), 0);
        setStats({ totalClicks: newTotalClicks, totalUrls: urls.length - 1 });
      } else {
        alert("Delete failed. Please try again.");
      }
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert(err?.response?.data?.message || "Delete failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Stats Cards - NEW UI FEATURE */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 sm:p-5 text-white shadow-lg">
            <p className="text-xs sm:text-sm opacity-90">Total URLs</p>
            <p className="text-2xl sm:text-3xl font-bold">{stats.totalUrls}</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-4 sm:p-5 text-white shadow-lg">
            <p className="text-xs sm:text-sm opacity-90">Total Clicks</p>
            <p className="text-2xl sm:text-3xl font-bold">{stats.totalClicks}</p>
          </div>
        </div>

        {/* Greeting + Create Form */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">
          <h2 className="text-base sm:text-lg font-semibold">
            Hi, {user?.name || user?.email?.split('@')[0] || "User"}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Create short links below. Custom codes are available!
          </p>
          <div className="mt-3 sm:mt-4">
            <UrlForm onCreated={loadUrls} />
          </div>
        </div>

        {/* User URLs Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm sm:text-md font-medium">Your URLs</h3>
            <button
              onClick={loadUrls}
              className="text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              Refresh ↻
            </button>
          </div>

          {loading ? (
            <div className="p-8 bg-white rounded-2xl shadow text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading your links...</p>
            </div>
          ) : urls.length > 0 ? (
            <div className="flex flex-col gap-3">
              {urls.map((url) => (
                <UserUrl key={url._id} url={url} onDeleted={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="p-6 sm:p-8 bg-white rounded-2xl shadow text-center">
              <p className="text-gray-500 text-sm sm:text-base">No shortened URLs yet.</p>
              <p className="text-xs text-gray-400 mt-1">Create your first short link above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}