import axios from "../utils/axiosInstance";

// -----------------------------
// AUTH
// -----------------------------
export const registerUser = (payload) =>
  axios.post("/auth/register", payload);

export const loginUser = (payload) => axios.post("/auth/login", payload);

export const getAuthProfile = () => axios.get("/auth/profile");

// -----------------------------
// USER (profile + user-owned data)
// -----------------------------
export const getUserProfile = () => axios.get("/users/profile");

export const getUserUrls = () => axios.get("/users/urls");
