import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', password: '', confirmPassword: ''
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // FIX: Use dynamic API URL from environment variables
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert("Passwords mismatch!");
    
    setLoading(true);
    try {
      // UPDATED: Replaced localhost with dynamic API_BASE
      const response = await fetch(`${API_BASE}/api/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2); 
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      alert(`Connection failed. Ensure your backend at ${API_BASE} is live.`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // UPDATED: Replaced localhost with dynamic API_BASE
      const response = await fetch(`${API_BASE}/api/users/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp })
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token); 
        alert("Verification successful! Welcome to the Hub.");
        navigate('/'); 
      } else {
        alert(data.message || "Invalid OTP code");
      }
    } catch (err) {
      alert("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-[850px] flex shadow-2xl rounded-sm overflow-hidden min-h-[550px]">
        
        {/* LEFT BANNER */}
        <div className="hidden md:flex w-[40%] bg-gradient-to-b from-[#1db954] to-[#14863c] p-10 flex-col text-white relative">
          <div className="z-10">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">Join the Hub</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed opacity-90">
              Create an account for <span className="text-yellow-300 font-bold">Verified Pharmacy</span> 
              access and faster checkout in Amritsar.
            </p>
          </div>
          <div className="mt-auto relative">
             <div className="text-8xl opacity-20 select-none mb-4">🏥</div>
             <p className="text-[10px] font-black uppercase tracking-widest border-t border-white/20 pt-4 opacity-70">
               Trusted Amritsar Pharmacy Network
             </p>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="flex-1 p-10 bg-white">
          {step === 1 ? (
            <>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800">Signup</h3>
                <p className="text-xs text-gray-400 mt-1 uppercase font-black tracking-widest">Create your pharmacy account</p>
              </div>
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <input 
                  type="text" placeholder="Full Name" required 
                  className="w-full border-b-2 p-2 outline-none focus:border-[#1db954] text-sm font-bold transition-colors" 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
                <input 
                  type="text" placeholder="Phone Number" required 
                  className="w-full border-b-2 p-2 outline-none focus:border-[#1db954] text-sm font-bold transition-colors" 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                />
                <input 
                  type="email" placeholder="Email ID" required 
                  className="w-full border-b-2 p-2 outline-none focus:border-[#1db954] text-sm font-bold transition-colors" 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
                <input 
                  type="password" placeholder="Password" required 
                  className="w-full border-b-2 p-2 outline-none focus:border-[#1db954] text-sm font-bold transition-colors" 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
                <input 
                  type="password" placeholder="Confirm Password" required 
                  className="w-full border-b-2 p-2 outline-none focus:border-[#1db954] text-sm font-bold transition-colors" 
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                />
                <button 
                  disabled={loading}
                  className="w-full bg-[#fb641b] text-white py-3 font-black uppercase shadow-lg hover:bg-[#f05a18] transition-all transform active:scale-95 text-sm mt-4 disabled:bg-gray-400"
                >
                  {loading ? "Processing..." : "Continue"}
                </button>
                <p className="text-center text-xs text-gray-400 font-bold pt-4">
                  Already have an account? <Link to="/login" className="text-[#2874f0] uppercase font-black ml-1">Log In</Link>
                </p>
              </form>
            </>
          ) : (
            <form onSubmit={handleVerifyOtp} className="text-center space-y-8 animate-fadeIn">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-800 uppercase italic">Verify Account</h2>
                <p className="text-xs text-gray-400 font-bold mt-1">Code sent to: <span className="text-[#1db954]">{formData.email}</span></p>
              </div>
              <div className="relative">
                <input 
                  type="text" maxLength="6" required
                  placeholder="000000"
                  className="w-full border-b-2 p-2 text-center text-3xl font-black tracking-[15px] outline-none focus:border-[#1db954] text-gray-800 placeholder-gray-100" 
                  onChange={(e) => setOtp(e.target.value)} 
                />
              </div>
              <button 
                disabled={loading}
                className="w-full bg-[#fb641b] text-white py-4 font-black uppercase shadow-xl hover:bg-[#f05a18] transition-all text-sm disabled:bg-gray-400"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="text-xs text-gray-400 font-bold uppercase tracking-widest hover:text-gray-600"
              >
                ← Back to Signup
              </button>
            </form>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Signup;