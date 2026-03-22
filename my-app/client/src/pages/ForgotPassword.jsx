import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email Input, 2: OTP & New Password
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState({ otp: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  
  // Timer States for Resend OTP
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Countdown Logic for OTP Resend
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // --- Step 1: Request OTP from Backend ---
  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    const resetRequest = fetch(`${API_BASE}/api/users/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Email not found.");
      return data;
    });

    toast.promise(resetRequest, {
      loading: '📡 Searching Hub Database...',
      success: 'Reset Code Sent to your Email!',
      error: (err) => `❌ ${err.message}`,
    });

    try {
      await resetRequest;
      setStep(2);
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2: Verify OTP and Update Password ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (details.newPassword !== details.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    setLoading(true);
    const updateRequest = fetch(`${API_BASE}/api/users/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        otp: details.otp,
        newPassword: details.newPassword
      })
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid or Expired OTP.");
      return data;
    });

    toast.promise(updateRequest, {
      loading: '⚖️ Authorizing Password Reset...',
      success: 'Password Updated! Secure Login Enabled.',
      error: (err) => `❌ ${err.message}`,
    });

    try {
      await updateRequest;
      navigate('/login');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Resend Reset Code ---
  const handleResendCode = async () => {
    const resendRequest = fetch(`${API_BASE}/api/users/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    toast.promise(resendRequest, {
      loading: '🔄 Dispatching fresh code...',
      success: 'New OTP Sent!',
      error: 'Resend failed. Try again later.',
    });

    try {
      const res = await resendRequest;
      if (res.ok) {
        setTimer(60);
        setCanResend(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center p-4 selection:bg-blue-100">
      <div className="bg-white w-full max-w-[450px] shadow-2xl rounded-sm p-8 overflow-hidden min-h-[400px]">
        
        <div className="mb-8 border-l-4 border-[#2874f0] pl-4">
          <h2 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter leading-none">
            {step === 1 ? "Forgot Password?" : "Set New Password"}
          </h2>
          <p className="text-[10px] text-gray-400 font-black mt-2 uppercase tracking-widest">
            {step === 1 
              ? "Recover your Amritsar Hub account" 
              : "Verify code and update credentials"}
          </p>
        </div>
        
        {step === 1 ? (
          <form onSubmit={handleSendCode} className="space-y-6 animate-fadeIn">
            <input 
              type="email" 
              placeholder="Enter Registered Email" 
              required 
              className="w-full border-b-2 p-3 outline-none focus:border-[#2874f0] text-sm font-bold transition-colors placeholder:text-gray-200"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button 
              disabled={loading}
              className="w-full bg-[#fb641b] text-white py-4 font-black uppercase shadow-lg hover:bg-[#f05a18] transition-all text-sm active:scale-95 disabled:bg-gray-400 italic tracking-widest"
            >
              {loading ? "SEARCHING..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6 animate-fadeIn">
            <div className="bg-blue-50/50 p-4 rounded-sm border border-blue-100 italic">
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest text-center">
                Protocol: Secure Code sent to {email}
              </p>
            </div>
            
            <input 
              type="text" 
              placeholder="6-DIGIT OTP" 
              required 
              maxLength="6"
              className="w-full border-b-2 p-3 outline-none focus:border-[#2874f0] text-center text-2xl font-black tracking-[12px] placeholder:tracking-normal placeholder:text-gray-200 placeholder:text-sm"
              onChange={(e) => setDetails({...details, otp: e.target.value})}
            />
            
            <div className="space-y-4">
              <input 
                type="password" 
                placeholder="New Secure Password" 
                required 
                className="w-full border-b-2 p-3 outline-none focus:border-[#2874f0] text-sm font-bold"
                onChange={(e) => setDetails({...details, newPassword: e.target.value})}
              />
              <input 
                type="password" 
                placeholder="Confirm New Password" 
                required 
                className="w-full border-b-2 p-3 outline-none focus:border-[#2874f0] text-sm font-bold"
                onChange={(e) => setDetails({...details, confirmPassword: e.target.value})}
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-[#fb641b] text-white py-4 font-black uppercase shadow-lg hover:bg-[#f05a18] transition-all text-sm active:scale-95 disabled:bg-gray-400 italic tracking-widest"
            >
              {loading ? "AUTHORIZING..." : "Update Password"}
            </button>

            <div className="text-center">
              {canResend ? (
                <button 
                  type="button" 
                  onClick={handleResendCode}
                  className="text-[10px] text-[#2874f0] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
                >
                  Resend Code
                </button>
              ) : (
                <p className="text-gray-300 text-[9px] font-black uppercase tracking-widest">
                  New Code available in <span className="text-blue-600">{timer}s</span>
                </p>
              )}
            </div>

            <button 
              type="button" 
              disabled={loading}
              onClick={() => setStep(1)}
              className="w-full text-[9px] text-gray-300 font-black uppercase tracking-[3px] hover:text-gray-600"
            >
              ← Back to Email Input
            </button>
          </form>
        )}

        <div className="mt-8 text-center border-t pt-6">
          <Link to="/login" className="text-[#2874f0] font-black text-xs uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
            Back to Login
          </Link>
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

export default ForgotPassword;