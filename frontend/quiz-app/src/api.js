// Central API configuration
// For local dev: uses http://localhost:8080
// For production: set REACT_APP_API_URL in Vercel/Netlify environment variables
const API = process.env.REACT_APP_API_URL || "http://localhost:8080";

export default API;
