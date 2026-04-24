import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slice/authSlice.js";
import { logoutUser } from "../api/auth.api.js";

export default function NavBar() {
  const { user, refreshToken } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      dispatch(logout());
      navigate("/auth");
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
        {/* Logo + Title */}
        <Link to="/" className="flex items-center gap-3 text-left group">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-indigo-600 group-hover:text-indigo-700 transition">
              Shortify
            </span>
            <span className="text-sm text-gray-500 hidden sm:inline">
              URL Shortener
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-3 sm:gap-4">
          <Link to="/" className="text-sm text-gray-600 hover:text-indigo-600 transition">
            Home
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm text-gray-600 hover:text-indigo-600 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700 transition cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}