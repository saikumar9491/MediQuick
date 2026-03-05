import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user info exists in storage on app load to maintain session
    const savedUser = localStorage.getItem('mediQuickUser');
    
    if (savedUser) {
      try {
        // Parse the JSON data safely
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem('mediQuickUser'); // Clean up broken data
      }
    }
    
    // Once checking is done, set loading to false to render the app
    setLoading(false);
  }, []);

  /**
   * @desc Log user in and persist data
   */
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('mediQuickUser', JSON.stringify(userData));
    localStorage.setItem('userToken', token);
  };

  /**
   * @desc Log user out and clear storage
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('mediQuickUser');
    localStorage.removeItem('userToken');
    // Optional: redirect to login after logout
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {/* The {!loading && children} prevents child components from 
        running before we know if a user is logged in.
      */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext easily in other components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};