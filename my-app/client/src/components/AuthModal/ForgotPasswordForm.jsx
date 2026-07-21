import React, { useState } from 'react';
import { Mail, Loader2, ArrowLeft, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { API_BASE } from '../../utils/apiConfig';
import { useAuth } from '../../context/AuthContext';

const ForgotPasswordForm = () => {
  const { setAuthModalView } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true); setError('');
    try {
      const response = await fetch(`${API_BASE}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong');
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full flex flex-col items-center text-center" style={{ paddingTop: '20px' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #00a2a4, #007b7d)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 8px 30px rgba(0,162,164,0.4)' }}>
          <CheckCircle2 size={36} color="white" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>Check your inbox!</h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '10px', maxWidth: '280px', lineHeight: 1.6 }}>
          We've sent a password reset link to <strong style={{ color: '#0f172a' }}>{email}</strong>. Check your spam folder too!
        </p>
        <button
          onClick={() => setAuthModalView('login')}
          style={{
            marginTop: '28px',
            padding: '13px 28px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #00a2a4, #007b7d)',
            color: 'white',
            fontWeight: 800,
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,162,164,0.4)',
          }}
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => setAuthModalView('login')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px', padding: 0 }}
        >
          <ArrowLeft size={15} /> Back to login
        </button>
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4" style={{ background: 'rgba(0,162,164,0.08)', border: '1px solid rgba(0,162,164,0.15)', display: 'flex' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00a2a4', display: 'inline-block' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#00a2a4', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Password Reset</span>
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Forgot your<br />
          <span style={{ color: '#00a2a4' }}>password?</span>
        </h2>
        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px', lineHeight: 1.6 }}>
          No worries! Enter your email and we'll send you a secure reset link instantly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '10px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <AlertCircle size={15} color="#ef4444" style={{ marginTop: '1px', flexShrink: 0 }} />
            <p style={{ fontSize: '13px', color: '#dc2626', fontWeight: 500 }}>{error}</p>
          </div>
        )}

        <div className="space-y-1.5">
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: '#9ca3af' }}>
              <Mail size={17} />
            </div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                display: 'block', width: '100%',
                paddingLeft: '42px', paddingRight: '14px',
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
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !email}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '14px',
            borderRadius: '14px',
            background: (loading || !email) ? '#9ca3af' : 'linear-gradient(135deg, #00a2a4, #007b7d)',
            color: 'white',
            fontWeight: 800,
            fontSize: '14px',
            border: 'none',
            cursor: (loading || !email) ? 'not-allowed' : 'pointer',
            boxShadow: (loading || !email) ? 'none' : '0 4px 20px rgba(0,162,164,0.4)',
            transition: 'all 0.2s',
            marginTop: '8px',
          }}
        >
          {loading ? (
            <><Loader2 size={17} className="animate-spin" /> Sending link...</>
          ) : (
            <><span>Send Reset Link</span><ArrowRight size={17} /></>
          )}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
