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

  return <p>Logging you in with Google...</p>;
}
