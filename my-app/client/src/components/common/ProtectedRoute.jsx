import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-blue-50 to-white px-4">
        <div className="flex flex-col items-center">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-blue-100 border-t-[#2874f0]"></div>
            <div className="z-10 text-lg font-black italic tracking-tight text-[#2874f0]">
              M+
            </div>
          </div>

          <p className="mt-4 text-xs font-black uppercase tracking-[3px] text-gray-400">
            Verifying Access
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;