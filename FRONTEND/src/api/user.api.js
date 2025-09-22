import axios from "../utils/axiosInstance";

// -----------------------------
// AUTH
// -----------------------------
export const registerUser = (payload) =>
  axios.post("/api/auth/register", payload);

export const loginUser = (payload) => axios.post("/api/auth/login", payload);

export const getAuthProfile = () => axios.get("/api/auth/profile");

// -----------------------------
// USER (profile + user-owned data)
// -----------------------------
export const getUserProfile = () => axios.get("/api/users/profile");

export const getUserUrls = () => axios.get("/api/users/urls");
