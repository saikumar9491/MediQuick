import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // 1. INITIAL LOAD & GLOBAL SYNC (On Refresh)
  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem('mediQuickUser');
      const savedToken = localStorage.getItem('userToken');
      
      if (savedUser && savedToken) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));

        try {
          const res = await fetch(`${API_BASE}/api/users/profile`, {
            headers: { 'Authorization': `Bearer ${savedToken}` }
          });
          
          if (res.ok) {
            const freshData = await res.json();
            setUser(freshData);
            localStorage.setItem('mediQuickUser', JSON.stringify(freshData));
          }
        } catch (err) {
          console.error("Profile Sync Failed:", err);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [API_BASE]);

  // 2. UPDATED LOGIN: MUST FETCH PROFILE DATA IMMEDIATELY
  const login = async (userData, userToken) => {
    // Save token immediately
    setToken(userToken);
    localStorage.setItem('userToken', userToken);

    try {
      // Fetch the full profile (Wishlist, Cart, Orders) from the DB
      const res = await fetch(`${API_BASE}/api/users/profile`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });

      if (res.ok) {
        const fullProfile = await res.json();
        setUser(fullProfile); // Updates state with real DB data
        localStorage.setItem('mediQuickUser', JSON.stringify(fullProfile));
      } else {
        // Fallback to basic data if profile fetch fails
        setUser(userData);
        localStorage.setItem('mediQuickUser', JSON.stringify(userData));
      }
    } catch (err) {
      console.error("Login Hub Sync Failed:", err);
      setUser(userData);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear(); 
    window.location.href = '/login'; 
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);