// src/utils/axiosInstance.js
import axios from "axios";
import store from "../store/store.js";
import { logout, updateToken } from "../store/slice/authSlice.js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Validate BASE_URL
if (!BASE_URL) {
  console.error("❌ VITE_API_BASE_URL is not defined in environment variables");
}

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout
});

// Track if token refresh is in progress
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 🔹 Attach JWT token if logged in
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const state = store?.getState?.();
      const token = state?.auth?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("Auth token read error:", e);
    }
    return config;
  },
  (err) => Promise.reject(err),
);

// 🔹 Handle 401 errors with token refresh
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    
    // Prevent infinite loops
    if (originalRequest._retry) {
      return Promise.reject(err);
    }
    
    // Only handle 401 errors
    if (err.response?.status !== 401) {
      return Promise.reject(err);
    }
    
    // Don't attempt refresh on auth endpoints (except refresh itself)
    if (originalRequest.url?.includes('/auth/refresh')) {
      store.dispatch(logout());
      window.location.href = "/auth";
      return Promise.reject(err);
    }
    
    // Mark as retried
    originalRequest._retry = true;
    
    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((refreshError) => Promise.reject(refreshError));
    }
    
    isRefreshing = true;
    
    try {
      const state = store?.getState?.();
      const refreshToken = state?.auth?.refreshToken;
      
      // No refresh token available, force logout
      if (!refreshToken) {
        store.dispatch(logout());
        window.location.href = "/auth";
        return Promise.reject(new Error("No refresh token available"));
      }
      
      // Attempt to refresh token
      const response = await axios.post(`${BASE_URL}/api/auth/refresh`, {
        refreshToken,
      }, {
        timeout: 10000,
        withCredentials: true,
      });
      
      const { accessToken } = response.data;
      
      if (!accessToken) {
        throw new Error("No access token in refresh response");
      }
      
      // Update store with new token
      store.dispatch(updateToken(accessToken));
      
      // Process queued requests
      processQueue(null, accessToken);
      
      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return axiosInstance(originalRequest);
      
    } catch (refreshError) {
      // Refresh failed - clear all auth state
      console.error("Token refresh failed:", refreshError.response?.data?.message || refreshError.message);
      processQueue(refreshError, null);
      store.dispatch(logout());
      
      // Clear local storage explicitly
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      
      // Redirect to login
      window.location.href = "/auth";
      return Promise.reject(refreshError);
      
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;