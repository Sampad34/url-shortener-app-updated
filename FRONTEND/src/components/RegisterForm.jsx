import { useState } from "react";
import { registerUser } from "../api/auth.api.js";
import { useDispatch } from "react-redux";
import {
  authStart,
  authSuccess,
  authFailure,
} from "../store/slice/authSlice.js";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    
    dispatch(authStart());
    try {
      const res = await registerUser({ name, email, password });
      const { accessToken, refreshToken, user } = res.data;
      dispatch(authSuccess({ token: accessToken, refreshToken, user }));
      navigate("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed";
      dispatch(authFailure(msg));
      alert(msg);
    }
  }

  return (
    <form onSubmit={submit} className="bg-white rounded shadow p-4 sm:p-6 w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">
        Create account
      </h3>

      <label className="block text-sm text-gray-600">Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        type="text"
        className="w-full border rounded px-3 py-2 mb-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-green-400"
      />

      <label className="block text-sm text-gray-600">Email</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        type="email"
        className="w-full border rounded px-3 py-2 mb-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-green-400"
      />

      <label className="block text-sm text-gray-600">Password</label>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        type="password"
        minLength="6"
        className="w-full border rounded px-3 py-2 mb-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-green-400"
      />

      <label className="block text-sm text-gray-600">Confirm Password</label>
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        type="password"
        className="w-full border rounded px-3 py-2 mb-4 text-sm sm:text-base outline-none focus:ring-2 focus:ring-green-400"
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 sm:py-2.5 rounded text-sm sm:text-base hover:bg-green-700 transition cursor-pointer"
      >
        Create account
      </button>
    </form>
  );
}