import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Accesses central login logic
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // UPDATED ENDPOINT: Changed to /api/users/login to match your backend routes
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();

      if (response.ok) {
        // Saves user to localStorage and state via Context
        login(data.user, data.token); 
        alert("Login Successful! Welcome back.");
        navigate('/'); 
      } else {
        // Handles errors like "Invalid credentials" or "Unverified account"
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Server error. Ensure your backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[800px] flex shadow-2xl rounded-sm overflow-hidden min-h-[500px]">
        
        {/* BRAND BANNER */}
        <div className="hidden md:flex w-1/3 bg-gradient-to-b from-[#2874f0] to-[#1a54b2] p-10 flex-col text-white relative">
          <div className="z-10">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">Welcome Back</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed opacity-90">
              Access your personalized pharmacy dashboard and track your 
              <span className="text-yellow-400 font-bold"> Amritsar Express</span> deliveries.
            </p>
          </div>
          
          <div className="mt-auto relative">
             <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
             <div className="text-8xl opacity-20 select-none">💊</div>
             <p className="mt-4 text-[10px] font-black uppercase tracking-widest border-t border-white/20 pt-4">
               MediQuick+ Verified Hub
             </p>
          </div>
        </div>

        {/* LOGIN FORM PANEL */}
        <div className="flex-1 p-10 bg-white">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-800">Login to your account</h3>
              <p className="text-xs text-gray-400 mt-1 uppercase font-black tracking-widest">Enter your verified credentials</p>
            </div>

            <input 
              type="email" 
              placeholder="Enter Email" 
              required 
              className="w-full border-b-2 py-3 outline-none focus:border-[#2874f0] text-sm font-bold transition-colors"
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            />
            
            <div className="space-y-2">
              <input 
                type="password" 
                placeholder="Enter Password" 
                required 
                className="w-full border-b-2 py-3 outline-none focus:border-[#2874f0] text-sm font-bold transition-colors"
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              />
              <Link to="/forgot-password" size="sm" className="block text-right text-[10px] text-[#2874f0] font-black uppercase tracking-widest hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-[#fb641b] text-white py-4 font-black uppercase shadow-lg hover:bg-[#f05a18] transition-all transform active:scale-95 text-sm disabled:bg-gray-400"
            >
              {loading ? "Authenticating..." : "Secure Login"}
            </button>
            
            <div className="pt-10">
              <p className="text-center text-xs text-gray-400 font-bold">
                New to MediQuick? <Link to="/signup" className="text-[#2874f0] uppercase font-black ml-1 border-b-2 border-transparent hover:border-[#2874f0]">Create an account</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;