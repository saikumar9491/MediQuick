import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoginForm from '../../components/AuthModal/LoginForm';
import SignupForm from '../../components/AuthModal/SignupForm';
import ForgotPasswordForm from '../../components/AuthModal/ForgotPasswordForm';

const AuthPage = () => {
  const { user, authModalView, setAuthModalView } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine initial view based on route path or state
  useEffect(() => {
    if (location.pathname === '/signup') {
      setAuthModalView('signup');
    } else if (location.pathname === '/forgot-password') {
      setAuthModalView('forgot-password');
    } else {
      setAuthModalView('login');
    }
  }, [location.pathname, setAuthModalView]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirectPath = location.state?.from?.pathname || location.state?.from || '/profile';
      navigate(redirectPath, { replace: true });
    }
  }, [user, location, navigate]);

  const activeTab = authModalView === 'signup' ? 'signup' : authModalView === 'forgot-password' ? 'forgot' : 'login';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between select-none">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-3xs">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-slate-700 hover:text-[#0057FF] text-xs font-bold transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Home</span>
        </button>

        {/* Compact Logo */}
        <div className="flex items-center gap-1">
          <div className="flex h-5.5 w-5.5 items-center justify-center rounded bg-[#0057FF] text-white">
            <span className="text-[9px] font-black">M</span>
          </div>
          <span className="text-xs font-black tracking-tight uppercase">
            <span className="text-[#0057FF]">MEDI</span><span className="text-[#FF6B00]">QUICK</span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
          <ShieldCheck size={10} />
          <span>Secure</span>
        </div>
      </div>

      {/* Main Authentication Container */}
      <div className="flex-1 flex flex-col justify-center px-4 py-6 max-w-md mx-auto w-full">
        {/* View Switcher Segmented Control */}
        <div className="bg-slate-200/70 p-1 rounded-2xl flex items-center mb-6 shadow-inner">
          <button
            onClick={() => {
              setAuthModalView('login');
              navigate('/login', { replace: true });
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'login'
                ? 'bg-white text-[#0057FF] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn size={13} />
            <span>Log In</span>
          </button>

          <button
            onClick={() => {
              setAuthModalView('signup');
              navigate('/signup', { replace: true });
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'signup'
                ? 'bg-white text-[#0057FF] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus size={13} />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
          {activeTab === 'login' && <LoginForm />}
          {activeTab === 'signup' && <SignupForm />}
          {activeTab === 'forgot' && <ForgotPasswordForm />}
        </div>
      </div>

      {/* Footer Assurance */}
      <div className="py-4 text-center text-[10px] text-slate-400 font-medium">
        🔒 256-Bit SSL Encrypted Healthcare Account Security
      </div>
    </div>
  );
};

export default AuthPage;
