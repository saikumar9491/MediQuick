import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get email from previous signup step (passed via state)
  const email = location.state?.email || "";
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // 1. Timer Logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // 2. Handle OTP Submission
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        // Log user in immediately after verification
        await login(data.user, data.token);
        navigate('/');
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (err) {
      alert("Verification failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Resend Request
  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setTimer(60);
        setCanResend(false);
        alert("A fresh OTP has been sent to your inbox!");
      }
    } catch (err) {
      alert("Could not resend OTP. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-10 shadow-2xl rounded-sm border-t-4 border-blue-600">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">Verify Your Account</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">
            Code sent to: <span className="text-blue-600">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <input 
            type="text" 
            maxLength="6"
            placeholder="ENTER 6-DIGIT OTP" 
            className="w-full border-b-2 py-4 text-center text-2xl font-black tracking-[10px] outline-none focus:border-blue-600 transition-colors"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button 
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full bg-[#fb641b] text-white py-4 font-black uppercase shadow-lg hover:bg-[#f05a18] transition-all disabled:bg-gray-300 active:scale-95"
          >
            {loading ? "Verifying..." : "Confirm Verification"}
          </button>
        </form>

        <div className="mt-8 text-center">
          {canResend ? (
            <button 
              onClick={handleResend}
              className="text-blue-600 font-black uppercase text-[10px] tracking-widest hover:underline"
            >
              Resend New Code
            </button>
          ) : (
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              Resend available in <span className="text-blue-600">{timer}s</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;