import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slice/authSlice.js";
import shortifyLogo from "../../public/shortify.svg";

export default function NavBar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
        {/* Logo + Title */}
        <Link to="/" className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2">
            <img
              src={shortifyLogo}
              alt="Shortify Logo"
              className="h-6 w-6 mt-1"
            />
            <div className="text-xl font-bold text-indigo-600">Shortify</div>
          </div>
          <div className="text-sm text-gray-500 sm:mt-0 mt-1">URL Shortener</div>
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-3 sm:gap-4 mt-2 sm:mt-0">
          <Link to="/" className="text-sm text-gray-600 hover:text-indigo-600">
            Home
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm text-gray-600 hover:text-indigo-600"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="text-sm text-indigo-600 font-medium">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
