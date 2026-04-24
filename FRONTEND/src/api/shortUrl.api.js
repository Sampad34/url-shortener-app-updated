import axios from "../utils/axiosInstance";

// Create a new short URL (supports custom code)
export const createShortUrl = (payload) => axios.post("/urls", payload);

// Get all URLs for the authenticated user
export const getMyUrls = () => axios.get("/urls/me");

// Delete a specific short URL by id
export const deleteUrl = (id) => axios.delete(`/urls/${id}`);

// Get analytics for a short URL
export const getUrlAnalytics = (shortId) => axios.get(`/analytics/${shortId}`);