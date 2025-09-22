import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slice/authSlice.js";
import shortifyLogo from "../../public/shortify.svg"

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
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-3">

         <img
            src={shortifyLogo}
            alt="Shortify Logo"
            className="h-6 w-6 mt-1"
          />

          <div className="text-xl font-bold text-indigo-600">Shortify</div>
          <div className="text-sm text-gray-500">URL Shortener</div>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-gray-600 hover:text-indigo-600">
            Home
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm text-gray-600 hover:text-indigo-600">
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
