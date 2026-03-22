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

  // 1. Standard Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Final check to ensure email is lowercase before hitting the API
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
      if (!response.ok) {
        throw new Error(data.message || "Invalid Credentials");
      }
      return data;
    });

    toast.promise(loginPromise, {
      loading: '🔐 Authenticating with Amritsar Hub...',
      success: 'Welcome back to MediQuick+!',
      error: (err) => `❌ ${err.message}`,
    });

    try {
      const data = await loginPromise;
      await login(data.user, data.token); 
      navigate('/'); 
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Google OAuth Login Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    
    const googlePromise = fetch(`${API_BASE}/api/users/google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credentialResponse.credential }),
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Google Login failed");
      }
      return data;
    });

    toast.promise(googlePromise, {
      loading: '📡 Establishing Secure Google Connect...',
      success: 'Google Identity Verified!',
      error: (err) => `❌ ${err.message}`,
    });

    try {
      const data = await googlePromise;
      await login(data.user, data.token);
      navigate('/');
    } catch (err) {
      console.error("Google Auth Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center p-4 selection:bg-blue-100">
      <div className="bg-white w-full max-w-[800px] flex shadow-2xl rounded-sm overflow-hidden min-h-[500px]">
        
        {/* BRAND BANNER */}
        <div className="hidden md:flex w-1/3 bg-gradient-to-b from-[#2874f0] to-[#1a54b2] p-10 flex-col text-white relative">
          <div className="z-10">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Welcome Back</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed opacity-90">
              Access your personalized pharmacy dashboard and track your 
              <span className="text-yellow-400 font-bold"> Amritsar Express</span> deliveries.
            </p>
          </div>
          
          <div className="mt-auto relative">
             <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
             <div className="text-8xl opacity-20 select-none">💊</div>
             <p className="mt-4 text-[10px] font-black uppercase tracking-widest border-t border-white/20 pt-4 opacity-70">
               MediQuick+ Verified Hub
             </p>
          </div>
        </div>

        {/* LOGIN FORM PANEL */}
        <div className="flex-1 p-10 bg-white">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-800 italic uppercase tracking-tighter leading-none">Login to your account</h3>
              <p className="text-xs text-gray-400 mt-1 uppercase font-black tracking-widest">Enter your verified credentials</p>
            </div>

            {/* EMAIL INPUT - Lowercase fix applied */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="bali@example.com" 
                value={credentials.email}
                required 
                className="w-full border-b-2 py-3 outline-none focus:border-[#2874f0] text-sm font-bold transition-colors lowercase placeholder:lowercase"
                onChange={(e) => setCredentials({...credentials, email: e.target.value.toLowerCase()})}
              />
            </div>
            
            {/* PASSWORD INPUT - Security Hide fix applied */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Secure Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={credentials.password}
                required 
                className="w-full border-b-2 py-3 outline-none focus:border-[#2874f0] text-sm font-bold transition-colors"
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              />
              <Link to="/forgot-password" size="sm" className="block text-right text-[10px] text-[#2874f0] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#fb641b] text-white py-4 font-black uppercase shadow-lg hover:bg-[#f05a18] transition-all transform active:scale-95 text-sm disabled:bg-gray-400 rounded-sm italic tracking-[2px]"
            >
              {loading ? "Establishing Link..." : "Secure Login"}
            </button>

            {/* GOOGLE LOGIN SECTION */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-[9px] font-black text-gray-300 uppercase tracking-widest">Or Secure Connect</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <div className="flex justify-center transition-opacity hover:opacity-90">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google Sign-In failed. Try again.')}
                useOneTap
                theme="outline"
                shape="rectangular"
                width="350px"
              />
            </div>
            
            <div className="pt-6">
              <p className="text-center text-xs text-gray-400 font-bold italic uppercase tracking-tighter">
                NEW TO MEDIQUICK? <Link to="/signup" className="text-[#2874f0] uppercase font-black ml-1 border-b-2 border-transparent hover:border-[#2874f0] transition-all">Create an account</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;