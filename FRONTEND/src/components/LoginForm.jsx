import { useState } from "react";
import { loginUser } from "../api/user.api.js";
import { useDispatch } from "react-redux";
import { authStart, authSuccess, authFailure } from "../store/slice/authSlice.js";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    dispatch(authStart());
    try {
      const res = await loginUser({ email, password });
      const { token, user } = res.data;
      dispatch(authSuccess({ token, user }));
      navigate("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      dispatch(authFailure(msg));
      alert(msg);
    }
  }

  return (
    <form onSubmit={submit} className="bg-white rounded shadow p-6 max-w-md w-full mx-auto">
      <h3 className="text-lg font-semibold mb-4">Sign in</h3>
      <label className="block text-sm text-gray-600">Email</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        type="email"
        className="w-full border rounded px-3 py-2 mb-3"
      />
      <label className="block text-sm text-gray-600">Password</label>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        type="password"
        className="w-full border rounded px-3 py-2 mb-4"
      />
      <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">
        Sign in
      </button>
    </form>
  );
}
