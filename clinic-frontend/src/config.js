// config.js
const API_BASE_URL = import.meta.env.MODE === "development"
  ? "https://localhost:5001/api"
  : "https://your-production-api.com";

export default API_BASE_URL;
