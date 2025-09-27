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
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ name, email }));
      dispatch(authSuccess({ token, user: { name, email } }));
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login?error=google", { replace: true });
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 sm:px-6">
      <div className="text-center bg-white p-6 sm:p-8 rounded-xl shadow-md max-w-md w-full">
        <p className="text-base sm:text-lg text-gray-700 font-medium">
          Logging you in with <span className="font-semibold text-blue-600">Google</span>...
        </p>
      </div>
    </div>
  );
}
