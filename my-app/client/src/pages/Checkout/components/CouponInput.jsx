import React, { useState, useRef, useEffect } from 'react';
import { Tag, CheckCircle, X, Loader2 } from 'lucide-react';
import { validateCoupon } from '../../../api/checkout';
import confetti from 'canvas-confetti';

export const CouponInput = ({ token, subtotal, cartCategories, appliedCoupon, onApply, onRemove }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const boxRef = useRef(null);
  const [justApplied, setJustApplied] = useState(false);

  useEffect(() => {
    if (appliedCoupon && justApplied && boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      const duration = 2000;
      const end = Date.now() + duration;

      (function frame() {
        // Global confetti shoots out of the box and across the screen
        confetti({
          particleCount: 10,
          spread: 120,
          startVelocity: 30,
          origin: { x, y },
          colors: ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'],
          zIndex: 9999
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
      setJustApplied(false);
    }
  }, [appliedCoupon, justApplied]);

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    try {
      const result = await validateCoupon(token, { code, subtotal, cartCategories });
      setJustApplied(true);
      onApply(result);
      setCode('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (appliedCoupon) {
    return (
      <div ref={boxRef} className="flex items-center justify-between gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
        <div className="flex items-center gap-2">
          <Tag size={14} className="text-emerald-600" />
          <div>
            <p className="text-xs font-semibold text-emerald-700">{appliedCoupon.code}</p>
            <p className="text-[10px] text-emerald-600">You save ₹{appliedCoupon.discountAmount}</p>
          </div>
        </div>
        <button onClick={onRemove} className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors relative z-10">
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-blue-400 transition-colors">
          <Tag size={13} className="text-slate-350 flex-shrink-0" />
          <input
            type="text"
            placeholder="Coupon code"
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleApply()}
            className="flex-1 bg-transparent text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : 'Apply'}
        </button>
      </div>
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-500">
          <X size={11} /> {error}
        </div>
      )}
    </div>
  );
};
