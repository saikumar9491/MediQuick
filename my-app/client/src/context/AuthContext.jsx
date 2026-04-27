import React, { createContext, useState, useEffect, useContext } from 'react';

import { API_BASE } from '../utils/apiConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

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

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4 text-center">
        <div className="relative">
          {/* Main Spinner */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
          
          {/* Inner Pulsing Core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-600/10 rounded-full animate-ping flex items-center justify-center">
              <span className="text-xl sm:text-2xl">🏥</span>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-2">
          <h2 className="text-sm font-black uppercase italic tracking-[0.3em] text-gray-800 animate-pulse">
            MediQuick+ Hub
          </h2>
          <p className="font-black uppercase italic text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.35em] text-gray-400">
            Establishing Secure Satellite Link...
          </p>
        </div>

        {/* Progress Bar Mockup */}
        <div className="mt-8 w-48 h-[2px] bg-gray-100 overflow-hidden relative mx-auto">
          <div className="absolute top-0 left-0 h-full bg-blue-600 animate-[loading_2s_infinite]"></div>
        </div>

        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

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
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);