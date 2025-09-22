import axios from "../utils/axiosInstance";

// Create a new short URL
export const createShortUrl = (payload) => axios.post("/api/urls", payload);

// Get all URLs for the authenticated user
export const getMyUrls = () => axios.get("/api/urls/me");

// Delete a specific short URL by id
export const deleteUrl = (id) => axios.delete(`/api/urls/${id}`);
