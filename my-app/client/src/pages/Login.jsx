import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const normalizedCredentials = {
      ...credentials,
      email: credentials.email.toLowerCase()
    };

    const loginPromise = fetch(`${API_BASE}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizedCredentials)
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid Credentials");
      return data;
    });

    toast.promise(loginPromise, {
      loading: '🔐 Authenticating...',
      success: 'Welcome back!',
      error: (err) => `❌ ${err.message}`,
    });

    try {
      const data = await loginPromise;
      await login(data.user, data.token);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);

    const googlePromise = fetch(`${API_BASE}/api/users/google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credentialResponse.credential }),
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Google Login failed");
      return data;
    });

    toast.promise(googlePromise, {
      loading: 'Connecting...',
      success: 'Google Login Success!',
      error: (err) => `❌ ${err.message}`,
    });

    try {
      const data = await googlePromise;
      await login(data.user, data.token);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center p-3 sm:p-6">
      
      <div className="w-full max-w-[900px] bg-white flex flex-col md:flex-row shadow-2xl rounded-xl overflow-hidden">
        
        {/* LEFT PANEL (Hidden on mobile) */}
        <div className="hidden md:flex md:w-1/3 bg-gradient-to-b from-[#2874f0] to-[#1a54b2] p-8 lg:p-10 text-white flex-col">
          <h2 className="text-2xl lg:text-3xl font-black italic uppercase">Welcome Back</h2>
          <p className="mt-4 text-sm opacity-90">
            Access your dashboard and track deliveries.
          </p>

          <div className="mt-auto">
            <div className="text-6xl opacity-20">💊</div>
            <p className="mt-4 text-[10px] uppercase tracking-widest opacity-70">
              MediQuick+
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 p-6 sm:p-8 md:p-10">
          <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">

            <div className="mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold italic uppercase">
                Login
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-400 uppercase font-black">
                Enter your credentials
              </p>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-[10px] uppercase font-black text-gray-400">
                Email
              </label>
              <input
                type="email"
                required
                value={credentials.email}
                className="w-full border-b-2 py-2 sm:py-3 text-sm outline-none focus:border-[#2874f0]"
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    email: e.target.value.toLowerCase()
                  })
                }
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-[10px] uppercase font-black text-gray-400">
                Password
              </label>
              <input
                type="password"
                required
                value={credentials.password}
                className="w-full border-b-2 py-2 sm:py-3 text-sm outline-none focus:border-[#2874f0]"
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    password: e.target.value
                  })
                }
              />
              <Link
                to="/forgot-password"
                className="block text-right text-[10px] text-blue-600 font-black mt-1"
              >
                Forgot?
              </Link>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#fb641b] text-white py-3 sm:py-4 text-xs sm:text-sm font-black uppercase tracking-widest rounded-lg active:scale-95"
            >
              {loading ? "Loading..." : "Login"}
            </button>

            {/* DIVIDER */}
            <div className="flex items-center gap-2">
              <div className="flex-grow border-t"></div>
              <span className="text-[10px] text-gray-300 uppercase">or</span>
              <div className="flex-grow border-t"></div>
            </div>

            {/* GOOGLE */}
            <div className="flex justify-center">
              <div className="w-full max-w-[280px] sm:max-w-[350px]">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error('Google failed')}
                  width="100%"
                />
              </div>
            </div>

            {/* SIGNUP */}
            <p className="text-center text-[11px] text-gray-400">
              New user?{' '}
              <Link to="/signup" className="text-blue-600 font-bold">
                Signup
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;