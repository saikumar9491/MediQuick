import React, { useState } from 'react';
import { User, Mail, Lock, Phone, Eye, EyeOff, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../../utils/apiConfig';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';

const InputField = ({ label, icon, type = 'text', name, value, onChange, placeholder, required, rightElement }) => (
  <div className="space-y-1.5">
    <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: '#9ca3af' }}>
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          display: 'block', width: '100%',
          paddingLeft: '42px', paddingRight: rightElement ? '44px' : '14px',
          paddingTop: '11px', paddingBottom: '11px',
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

const SignupForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login, setAuthModalView, setShowAuthModal } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/users/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Google signup failed');
      login(data.token, data.user);
      setShowAuthModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setError('Please fill in all fields'); return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters'); return;
    }
    setLoading(true); setError('');
    try {
      const response = await fetch(`${API_BASE}/api/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, phone: formData.phone, password: formData.password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');
      setShowAuthModal(false);
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4" style={{ background: 'rgba(0,162,164,0.08)', border: '1px solid rgba(0,162,164,0.15)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00a2a4', display: 'inline-block' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#00a2a4', letterSpacing: '0.06em', textTransform: 'uppercase' }}>New Member</span>
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Join<br />
          <span style={{ color: '#00a2a4' }}>MediQuick</span>
        </h2>
        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>Free delivery on your first 3 orders!</p>
      </div>

      {/* Google Signup */}
      <div className="mb-5">
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google authentication failed')}
            shape="pill"
            size="large"
            width="340"
            text="signup_with"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="relative flex items-center mb-5">
        <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
        <span style={{ margin: '0 12px', fontSize: '11px', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase' }}>or with email</span>
        <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '10px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <AlertCircle size={15} color="#ef4444" style={{ marginTop: '1px', flexShrink: 0 }} />
            <p style={{ fontSize: '13px', color: '#dc2626', fontWeight: 500 }}>{error}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <InputField label="Full Name" icon={<User size={16} />} name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
          <InputField label="Phone" icon={<Phone size={16} />} type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" required />
        </div>

        <InputField label="Email Address" icon={<Mail size={16} />} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />

        <div>
          <InputField
            label="Password"
            icon={<Lock size={16} />}
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Min. 8 characters"
            required
            rightElement={
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          <PasswordStrengthIndicator password={formData.password} />
        </div>

        <button
          type="submit"
          disabled={loading || formData.password.length < 8}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '14px',
            borderRadius: '14px',
            background: (loading || formData.password.length < 8) ? '#9ca3af' : 'linear-gradient(135deg, #00a2a4, #007b7d)',
            color: 'white',
            fontWeight: 800,
            fontSize: '14px',
            border: 'none',
            cursor: (loading || formData.password.length < 8) ? 'not-allowed' : 'pointer',
            boxShadow: (loading || formData.password.length < 8) ? 'none' : '0 4px 20px rgba(0,162,164,0.4)',
            transition: 'all 0.2s',
            marginTop: '8px',
          }}
        >
          {loading ? (
            <><Loader2 size={17} className="animate-spin" /> Creating account...</>
          ) : (
            <><span>Create Free Account</span><ArrowRight size={17} /></>
          )}
        </button>

        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>Already have an account? </span>
          <button
            type="button"
            onClick={() => setAuthModalView('login')}
            style={{ fontSize: '13px', fontWeight: 800, color: '#00a2a4', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Sign in →
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
