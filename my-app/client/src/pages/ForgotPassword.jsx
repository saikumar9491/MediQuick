import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email Input, 2: OTP & New Password
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState({ otp: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  // --- Step 1: Request OTP from Backend ---
  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // UPDATED ENDPOINT: Changed from /api/auth/ to /api/users/
      const response = await fetch('http://localhost:5000/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();

      if (response.ok) {
        setStep(2);
      } else {
        alert(data.message || "Email not found in our records.");
      }
    } catch (err) {
      alert("Server error. Ensure your backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2: Verify OTP and Update Password ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (details.newPassword !== details.confirmPassword) {
      return alert("Passwords do not match!");
    }

    setLoading(true);
    try {
      // UPDATED ENDPOINT: Changed from /api/auth/ to /api/users/
      const response = await fetch('http://localhost:5000/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: details.otp,
          newPassword: details.newPassword
        })
      });
      const data = await response.json();

      if (response.ok) {
        alert("Password updated successfully! Please login.");
        navigate('/login');
      } else {
        alert(data.message || "Invalid or expired OTP.");
      }
    } catch (err) {
      alert("Request failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[450px] shadow-2xl rounded-sm p-8 overflow-hidden min-h-[400px]">
        
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-800 uppercase italic">
            {step === 1 ? "Forgot Password?" : "Set New Password"}
          </h2>
          <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">
            {step === 1 
              ? "Recover your Amritsar Hub account" 
              : "Verify code and update credentials"}
          </p>
        </div>
        
        {step === 1 ? (
          <form onSubmit={handleSendCode} className="space-y-6 animate-fadeIn">
            <input 
              type="email" 
              placeholder="Enter Email Address" 
              required 
              className="w-full border-b-2 p-3 outline-none focus:border-[#2874f0] text-sm font-bold transition-colors"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button 
              disabled={loading}
              className="w-full bg-[#fb641b] text-white py-4 font-black uppercase shadow-lg hover:bg-[#f05a18] transition-all text-sm disabled:bg-gray-400"
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6 animate-fadeIn">
            <div className="bg-blue-50 p-3 rounded-sm mb-4">
              <p className="text-[10px] text-blue-600 font-bold uppercase text-center">
                Code sent to: {email}
              </p>
            </div>
            <input 
              type="text" 
              placeholder="6-Digit OTP" 
              required 
              maxLength="6"
              className="w-full border-b-2 p-3 outline-none focus:border-[#2874f0] text-center text-xl font-black tracking-[10px]"
              onChange={(e) => setDetails({...details, otp: e.target.value})}
            />
            <input 
              type="password" 
              placeholder="New Password" 
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
            <button 
              disabled={loading}
              className="w-full bg-[#fb641b] text-white py-4 font-black uppercase shadow-lg hover:bg-[#f05a18] transition-all text-sm disabled:bg-gray-400"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
            <button 
              type="button" 
              disabled={loading}
              onClick={() => setStep(1)}
              className="w-full text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:text-gray-600"
            >
              ← Change Email
            </button>
          </form>
        )}

        <div className="mt-8 text-center border-t pt-6">
          <Link to="/login" className="text-[#2874f0] font-black text-xs uppercase tracking-widest hover:underline">
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