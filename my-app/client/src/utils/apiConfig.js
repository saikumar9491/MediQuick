/**
 * CENTRAL HUB API CONFIGURATION
 * 
 * Provides a single source of truth for the backend API URL.
 * Falls back to the production Render URL to prevent broken links for guests.
 */

const getApiBase = () => {
  // Priority 1: Local Development Force (Override .env)
  if (import.meta.env && import.meta.env.MODE === 'development') {
    return 'http://localhost:5000';
  }

  // Priority 2: Environment Variable (Vite/Vercel)
  if (import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.endsWith('/') 
      ? import.meta.env.VITE_API_URL.slice(0, -1) 
      : import.meta.env.VITE_API_URL;
  }

  // Priority 3: Production Render Fallback
  // Using the stable Render URL to ensure guests can always see products
  return 'https://mediquick-53b1.onrender.com';
};

export const API_BASE = getApiBase();

export default API_BASE;
