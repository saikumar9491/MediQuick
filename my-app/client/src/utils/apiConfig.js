/**
 * CENTRAL HUB API CONFIGURATION
 * 
 * Provides a single source of truth for the backend API URL.
 * Falls back to the production Render URL to prevent broken links for guests.
 */

const getApiBase = () => {
  // Priority 1: Environment Variable (Vite/Vercel)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.endsWith('/') 
      ? import.meta.env.VITE_API_URL.slice(0, -1) 
      : import.meta.env.VITE_API_URL;
  }

  // Priority 2: Production Render Fallback
  // Using the stable Render URL to ensure guests can always see products
  return 'https://mediquick-53b1.onrender.com';
};

export const API_BASE = getApiBase();

export default API_BASE;
