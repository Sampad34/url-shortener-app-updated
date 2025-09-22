import axios from "../utils/axiosInstance";

// Create a new short URL
export const createShortUrl = (payload) => axios.post("/urls", payload);

// Get all URLs for the authenticated user
export const getMyUrls = () => axios.get("/urls/me");

// Delete a specific short URL by id
export const deleteUrl = (id) => axios.delete(`/urls/${id}`);
