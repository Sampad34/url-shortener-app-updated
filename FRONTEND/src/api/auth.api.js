import axios from "../utils/axiosInstance";

// -----------------------------
// AUTH API
// -----------------------------
export const registerUser = (payload) => axios.post("/auth/register", payload);
export const loginUser = (payload) => axios.post("/auth/login", payload);
export const refreshToken = (refreshToken) => axios.post("/auth/refresh", { refreshToken });
export const logoutUser = (refreshToken) => axios.post("/auth/logout", { refreshToken });