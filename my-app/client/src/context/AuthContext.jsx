import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('userToken') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem('mediQuickUser');
      const savedToken = localStorage.getItem('userToken');

      if (!savedUser || !savedToken) {
        setLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);

        const res = await fetch(`${API_BASE}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (res.ok) {
          const freshData = await res.json();
          setUser(freshData);
          localStorage.setItem('mediQuickUser', JSON.stringify(freshData));
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('mediQuickUser');
          localStorage.removeItem('userToken');
        }
      } catch (err) {
        console.error('Profile Sync Failed:', err);
        setUser(null);
        setToken(null);
        localStorage.removeItem('mediQuickUser');
        localStorage.removeItem('userToken');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [API_BASE]);

  const login = async (userData, userToken) => {
    setToken(userToken);
    localStorage.setItem('userToken', userToken);

    try {
      const res = await fetch(`${API_BASE}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (res.ok) {
        const fullProfile = await res.json();
        setUser(fullProfile);
        localStorage.setItem('mediQuickUser', JSON.stringify(fullProfile));
      } else {
        setUser(userData);
        localStorage.setItem('mediQuickUser', JSON.stringify(userData));
      }
    } catch (err) {
      console.error('Login Hub Sync Failed:', err);
      setUser(userData);
      localStorage.setItem('mediQuickUser', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mediQuickUser');
    localStorage.removeItem('userToken');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        setUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);