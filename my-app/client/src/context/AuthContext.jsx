import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Added token state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('mediQuickUser');
    const savedToken = localStorage.getItem('userToken'); // Retrieve token
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken); // Update token state
    localStorage.setItem('mediQuickUser', JSON.stringify(userData));
    localStorage.setItem('userToken', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear(); 
    // This fixed your "Not Found" video issue!
    window.location.href = '/login'; 
  };

  return (
    // Added 'token' to the value provider
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);