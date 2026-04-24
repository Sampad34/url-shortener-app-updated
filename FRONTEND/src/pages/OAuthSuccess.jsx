import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authSuccess } from "../store/slice/authSlice.js";

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    const name = searchParams.get("name");
    const email = searchParams.get("email");

    if (token) {
      // Note: Google OAuth doesn't return refresh token in redirect
      // Refresh token is handled via httpOnly cookie on backend
      dispatch(authSuccess({ 
        token, 
        user: { name, email },
        refreshToken: null // Will be handled by cookie
      }));
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/auth?error=google", { replace: true });
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 sm:px-6">
      <div className="text-center bg-white p-6 sm:p-8 rounded-xl shadow-md max-w-md w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-base sm:text-lg text-gray-700 font-medium">
          Logging you in with <span className="font-semibold text-blue-600">Google</span>...
        </p>
        <p className="text-xs text-gray-400 mt-2">Please wait while we redirect you</p>
      </div>
    </div>
  );
}