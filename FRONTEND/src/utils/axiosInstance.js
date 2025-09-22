// src/utils/axiosInstance.js
import axios from "axios";
import store from "../store/store.js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// 🔹 Attach JWT token if logged in
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const state = store?.getState?.();
      const token = state?.auth?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      console.error("Auth token read error:", e);
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// 🔹 Handle 401 errors globally → redirect to /auth
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Clear Redux auth state if needed
      try {
        store.dispatch({ type: "auth/logout" });
      } catch (e) {
        console.error(e);
      }
      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
