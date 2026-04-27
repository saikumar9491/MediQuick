import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

import { API_BASE } from '../utils/apiConfig';

const Signup = () => {
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', password: '', confirmPassword: ''
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  
  // PASSWORD VISIBILITY STATE
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords mismatch!");
    }
    
    setLoading(true);
    
    const signupRequest = fetch(`${API_BASE}/api/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        password: formData.password
      })
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      return data;
    });

    toast.promise(signupRequest, {
      loading: '📋 Registering Identity...',
      success: 'OTP Dispatched to your Email!',
      error: (err) => `❌ ${err.message}`,
    });

    try {
      await signupRequest;
      setStep(2); 
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const verifyRequest = fetch(`${API_BASE}/api/users/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, otp })
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid OTP");
      return data;
    });

    toast.promise(verifyRequest, {
      loading: '⚖️ Verifying with Amritsar Hub...',
      success: 'Welcome to the Hub!',
      error: (err) => `❌ ${err.message}`,
    });

    try {
      const data = await verifyRequest;
      await login(data.user, data.token); 
      navigate('/'); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    const resendRequest = fetch(`${API_BASE}/api/users/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email })
    });

    toast.promise(resendRequest, {
      loading: '📡 Requesting fresh code...',
      success: 'New OTP Sent!',
      error: 'Failed to resend. Try again later.',
    });

    try {
      const res = await resendRequest;
      if (res.ok) {
        setTimer(60);
        setCanResend(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center p-4 font-sans selection:bg-green-100">
      <div className="bg-white w-full max-w-[850px] flex shadow-2xl rounded-sm overflow-hidden min-h-[550px]">
        
        {/* LEFT BANNER */}
        <div className="hidden md:flex w-[40%] bg-gradient-to-b from-[#1db954] to-[#14863c] p-10 flex-col text-white relative">
          <div className="z-10">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Join the Hub</h2>
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
            <div className="animate-fadeIn">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 italic uppercase tracking-tighter leading-none">Signup</h3>
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
                  className="w-full border-b-2 p-2 outline-none focus:border-[#1db954] text-sm font-bold transition-colors lowercase placeholder:lowercase" 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
                
                {/* PASSWORD FIELD WITH TOGGLE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <input 
                      type={showPass ? "text" : "password"} 
                      placeholder="Password" required 
                      className="w-full border-b-2 p-2 outline-none focus:border-[#1db954] text-sm font-bold transition-colors" 
                      onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-2 top-2 text-gray-400 hover:text-[#1db954]"
                    >
                      {showPass ? "👁️" : "🙈"}
                    </button>
                  </div>

                  <div className="relative">
                    <input 
                      type={showConfirmPass ? "text" : "password"} 
                      placeholder="Confirm Password" required 
                      className="w-full border-b-2 p-2 outline-none focus:border-[#1db954] text-sm font-bold transition-colors" 
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-2 top-2 text-gray-400 hover:text-[#1db954]"
                    >
                      {showConfirmPass ? "👁️" : "🙈"}
                    </button>
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-[#fb641b] text-white py-3 font-black uppercase shadow-lg hover:bg-[#f05a18] transition-all transform active:scale-95 text-sm mt-4 disabled:bg-gray-400 rounded-sm italic tracking-widest"
                >
                  {loading ? "Initializing..." : "Register Identity"}
                </button>
                <p className="text-center text-xs text-gray-400 font-bold pt-4">
                  ALREADY REGISTERED? <Link to="/login" className="text-[#2874f0] uppercase font-black ml-1 border-b-2 border-transparent hover:border-[#2874f0]">Log In</Link>
                </p>
              </form>
            </div>
          ) : (
            <div className="text-center space-y-8 animate-fadeIn">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter leading-none">Verify Account</h2>
                <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-widest">
                  Secure Code sent to: <span className="text-[#1db954] lowercase">{formData.email}</span>
                </p>
              </div>
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="relative">
                  <input 
                    type="text" maxLength="6" required
                    placeholder="000000"
                    className="w-full border-b-2 p-2 text-center text-3xl font-black tracking-[15px] outline-none focus:border-[#1db954] text-gray-800 placeholder-gray-100" 
                    onChange={(e) => setOtp(e.target.value)} 
                  />
                </div>
                <button 
                  disabled={loading || otp.length < 6}
                  className="w-full bg-[#fb641b] text-white py-4 font-black uppercase shadow-xl hover:bg-[#f05a18] transition-all text-sm active:scale-95 disabled:bg-gray-400 rounded-sm italic tracking-widest"
                >
                  {loading ? "Syncing..." : "Authorize Account"}
                </button>
              </form>

              <div className="pt-4">
                {canResend ? (
                  <button type="button" onClick={handleResendOtp} className="text-[#2874f0] font-black uppercase text-[10px] tracking-widest hover:underline">Resend New Code</button>
                ) : (
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">New code available in <span className="text-green-600">{timer}s</span></p>
                )}
              </div>

              <button type="button" onClick={() => setStep(1)} className="text-[9px] text-gray-300 font-black uppercase tracking-[3px] hover:text-gray-500 pt-4">← Back to Identity Form</button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Signup;