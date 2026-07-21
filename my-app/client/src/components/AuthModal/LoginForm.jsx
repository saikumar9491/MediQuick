import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../utils/apiConfig';
import { GoogleLogin } from '@react-oauth/google';

const InputField = ({ label, icon, type = 'text', value, onChange, placeholder, required, rightElement }) => (
  <div className="space-y-1.5">
    <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: '#9ca3af' }}>
        {icon}
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          display: 'block', width: '100%',
          paddingLeft: '42px', paddingRight: rightElement ? '44px' : '14px',
          paddingTop: '12px', paddingBottom: '12px',
          border: '1.5px solid #e5e7eb',
          borderRadius: '12px',
          fontSize: '14px',
          color: '#111827',
          background: '#f9fafb',
          outline: 'none',
          transition: 'all 0.2s',
          boxSizing: 'border-box',
        }}
        onFocus={e => { e.target.style.border = '1.5px solid #00a2a4'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(0,162,164,0.1)'; }}
        onBlur={e => { e.target.style.border = '1.5px solid #e5e7eb'; e.target.style.background = '#f9fafb'; e.target.style.boxShadow = 'none'; }}
      />
      {rightElement && (
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
  </div>
);

const LoginForm = () => {
  const { login, setAuthModalView, setShowAuthModal } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/users/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Google login failed');
      login(data.token, data.user);
      setShowAuthModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true); setError('');
    try {
      const response = await fetch(`${API_BASE}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      login(data.token, data.user);
      setShowAuthModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4" style={{ background: 'rgba(0,162,164,0.08)', border: '1px solid rgba(0,162,164,0.15)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00a2a4', display: 'inline-block' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#00a2a4', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Welcome Back</span>
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Sign in to<br />
          <span style={{ color: '#00a2a4' }}>MediQuick</span>
        </h2>
        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>Your health, delivered in minutes</p>
      </div>

      {/* Google Login */}
      <div className="mb-6">
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google authentication failed')}
            shape="pill"
            size="large"
            width="340"
            text="continue_with"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="relative flex items-center mb-6">
        <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
        <span style={{ margin: '0 12px', fontSize: '11px', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase' }}>or sign in with email</span>
        <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '10px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <AlertCircle size={15} color="#ef4444" style={{ marginTop: '1px', flexShrink: 0 }} />
            <p style={{ fontSize: '13px', color: '#dc2626', fontWeight: 500 }}>{error}</p>
          </div>
        )}

        <InputField
          label="Email Address"
          icon={<Mail size={17} />}
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <InputField
          label="Password"
          icon={<Lock size={17} />}
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          rightElement={
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          }
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              style={{ accentColor: '#00a2a4', width: 15, height: 15 }}
            />
            <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => setAuthModalView('forgot-password')}
            style={{ fontSize: '13px', fontWeight: 700, color: '#00a2a4', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '14px',
            borderRadius: '14px',
            background: loading ? '#9ca3af' : 'linear-gradient(135deg, #00a2a4, #007b7d)',
            color: 'white',
            fontWeight: 800,
            fontSize: '14px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(0,162,164,0.4)',
            transition: 'all 0.2s',
            marginTop: '8px',
          }}
          onMouseEnter={e => { if (!loading) { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 25px rgba(0,162,164,0.5)'; }}}
          onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(0,162,164,0.4)'; }}
        >
          {loading ? (
            <><Loader2 size={17} className="animate-spin" /> Signing in...</>
          ) : (
            <><span>Continue</span><ArrowRight size={17} /></>
          )}
        </button>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>Don't have an account? </span>
          <button
            type="button"
            onClick={() => setAuthModalView('signup')}
            style={{ fontSize: '13px', fontWeight: 800, color: '#00a2a4', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Create one free →
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
