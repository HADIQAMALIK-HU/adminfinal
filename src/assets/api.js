// src/assets/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://backend-s2hb.vercel.app",
});

export default api;
