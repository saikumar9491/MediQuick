import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import { API_BASE } from '../utils/apiConfig';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();

  // Wake up protocol
  useEffect(() => {
    fetch(`${API_BASE}/`).catch(() => console.log('📡 Hub initializing...'));
  }, []);

  // Security Timer Protocol
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

  /**
   * --- PROTOCOL 1: Request Reset Code ---
   */
  const handleSendCode = async (e) => {
    if (e) e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    
    setLoading(true);
    const userEmail = email.trim().toLowerCase();

    try {
      const response = await fetch(`${API_BASE}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Hub Search Failed');
      }

      toast.success('Reset Code Sent to your Email!');
      setStep(2);
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      console.error('Connection Error:', err);
      toast.error(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * --- PROTOCOL 2: Authorize New Credentials ---
   */
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (details.newPassword !== details.confirmPassword) {
      return toast.error('Passwords do not match!');
    }
    if (details.otp.length < 6) {
      return toast.error('Please enter the full 6-digit code');
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: details.otp.trim(),
          newPassword: details.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid or Expired OTP.');
      }

      toast.success('Password Updated! Secure Login Enabled.');
      navigate('/login');
    } catch (err) {
      console.error('Reset Error:', err);
      toast.error(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    handleSendCode();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f1f3f6] p-4 font-sans selection:bg-blue-100 sm:p-6">
      <div className="min-h-[400px] w-full max-w-[450px] overflow-hidden rounded-2xl sm:rounded-sm bg-white p-5 sm:p-8 shadow-2xl transition-all duration-500">
        
        {/* Hub Header Section */}
        <div className="mb-6 sm:mb-8 border-l-4 border-[#2874f0] pl-3 sm:pl-4">
          <h2 className="text-xl sm:text-2xl font-black uppercase italic leading-none tracking-tighter text-gray-800">
            {step === 1 ? 'Forgot Password?' : 'Set New Password'}
          </h2>
          <p className="mt-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[2px] sm:tracking-widest text-gray-400">
            {step === 1
              ? 'Recover your Amritsar Hub account'
              : 'Verify code and update credentials'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendCode} className="animate-fadeIn space-y-5 sm:space-y-6">
            <div className="relative">
              <input
                type="email"
                placeholder="Enter Registered Email"
                required
                value={email}
                className="w-full border-b-2 p-3 text-sm font-bold lowercase outline-none transition-all placeholder:text-gray-300 focus:border-[#2874f0]"
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#fb641b] py-3.5 sm:py-4 text-xs sm:text-sm font-black uppercase italic tracking-[2px] sm:tracking-widest text-white shadow-lg transition-all hover:bg-[#f05a18] active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'SEARCHING HUB...' : 'Send Reset Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="animate-fadeIn space-y-5 sm:space-y-6">
            <div className="rounded-xl sm:rounded-sm border border-blue-100 bg-blue-50/50 p-3 sm:p-4 italic">
              <p className="text-center text-[9px] sm:text-[10px] font-black uppercase tracking-[2px] sm:tracking-widest leading-relaxed text-blue-600">
                Protocol: Secure Code sent to <br />
                <span className="font-bold lowercase text-gray-800">{email}</span>
              </p>
            </div>

            <input
              type="text"
              placeholder="000000"
              required
              value={details.otp}
              maxLength="6"
              className="w-full border-b-2 p-3 text-center text-xl sm:text-2xl font-black tracking-[8px] sm:tracking-[12px] outline-none placeholder:text-sm placeholder:tracking-normal placeholder:text-gray-300 focus:border-[#2874f0]"
              onChange={(e) => setDetails({ ...details, otp: e.target.value.replace(/[^0-9]/g, '') })}
            />

            <div className="space-y-4">
              <input
                type="password"
                placeholder="New Secure Password"
                required
                value={details.newPassword}
                className="w-full border-b-2 p-3 text-sm font-bold outline-none focus:border-[#2874f0]"
                onChange={(e) => setDetails({ ...details, newPassword: e.target.value })}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                required
                value={details.confirmPassword}
                className="w-full border-b-2 p-3 text-sm font-bold outline-none focus:border-[#2874f0]"
                onChange={(e) => setDetails({ ...details, confirmPassword: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#fb641b] py-3.5 sm:py-4 text-xs sm:text-sm font-black uppercase italic tracking-[2px] sm:tracking-widest text-white shadow-lg transition-all hover:bg-[#f05a18] active:scale-95 disabled:bg-gray-400"
            >
              {loading ? 'AUTHORIZING...' : 'Update Password'}
            </button>

            <div className="flex flex-col gap-3 sm:gap-4 text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-[10px] font-black uppercase tracking-widest text-[#2874f0] hover:underline decoration-2 underline-offset-4"
                >
                  Resend Code
                </button>
              ) : (
                <p className="text-[9px] font-black uppercase tracking-[2px] sm:tracking-widest text-gray-300">
                  New Code available in <span className="text-blue-600 font-bold">{timer}s</span>
                </p>
              )}

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setStep(1);
                  setDetails({ otp: '', newPassword: '', confirmPassword: '' });
                }}
                className="w-full text-[9px] font-black uppercase tracking-[2px] sm:tracking-[3px] text-gray-300 transition-colors hover:text-gray-500"
              >
                ← Change Email
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 border-t pt-5 sm:pt-6 text-center">
          <Link
            to="/login"
            className="text-[11px] sm:text-xs font-black uppercase tracking-[2px] sm:tracking-widest text-[#2874f0] hover:underline decoration-2 underline-offset-4"
          >
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