import React, { useState, useRef, useEffect } from 'react';
import { Tag, CheckCircle, X, Loader2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { validateCoupon, fetchActiveCoupons } from '../../../api/checkout';
import confetti from 'canvas-confetti';

export const CouponInput = ({ token, subtotal, cartCategories, appliedCoupon, onApply, onRemove }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const boxRef = useRef(null);
  const [justApplied, setJustApplied] = useState(false);
  const [showCouponsList, setShowCouponsList] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [fetchingCoupons, setFetchingCoupons] = useState(false);

  useEffect(() => {
    const loadCoupons = async () => {
      setFetchingCoupons(true);
      try {
        const fetched = await fetchActiveCoupons();
        if (Array.isArray(fetched) && fetched.length > 0) {
          // Display STRICTLY active coupons added by Admin from backend DB
          const seen = new Map();
          fetched.forEach(c => {
            if (!c.code) return;
            const upperCode = c.code.trim().toUpperCase();
            if (!seen.has(upperCode)) {
              seen.set(upperCode, {
                code: upperCode,
                discountType: c.discountType,
                discountValue: c.discountValue,
                description: c.description || (c.discountType === 'Percentage' ? `${c.discountValue}% OFF` : `Flat ₹${c.discountValue} OFF`),
                minOrderValue: c.minOrderValue || 0,
              });
            }
          });
          setAvailableCoupons(Array.from(seen.values()));
        } else {
          setAvailableCoupons([]);
        }
      } catch (err) {
        console.error('Failed to load active coupons:', err);
        setAvailableCoupons([]);
      } finally {
        setFetchingCoupons(false);
      }
    };
    loadCoupons();
  }, []);

  useEffect(() => {
    if (appliedCoupon && justApplied && boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      const duration = 2000;
      const end = Date.now() + duration;

      (function frame() {
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

  const handleApplyCode = async (codeToApply) => {
    const targetCode = (codeToApply || code).trim();
    if (!targetCode) return;
    setLoading(true);
    setError('');
    try {
      const result = await validateCoupon(token, { code: targetCode, subtotal, cartCategories });
      setJustApplied(true);
      onApply(result);
      setCode('');
      setShowCouponsList(false);
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
        <button onClick={onRemove} className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors relative z-10 cursor-pointer">
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {/* Input row */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-blue-400 transition-colors">
          <Tag size={13} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Coupon code"
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleApplyCode()}
            className="flex-1 bg-transparent text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none uppercase"
          />
        </div>
        <button
          onClick={() => handleApplyCode()}
          disabled={loading || !code.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : 'Apply'}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
          <X size={11} /> {error}
        </div>
      )}

      {/* Available Coupons Toggle — ONLY shown if admin has active coupons in DB */}
      {availableCoupons.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowCouponsList(!showCouponsList)}
            className="flex items-center justify-between w-full text-left py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer group"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-500 group-hover:rotate-12 transition-transform" />
              <span>Available Coupons ({availableCoupons.length})</span>
            </span>
            {showCouponsList ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {/* Coupons Card List */}
          {showCouponsList && (
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-1">
              {fetchingCoupons ? (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 p-2">
                  <Loader2 size={12} className="animate-spin text-blue-500" /> Loading coupons...
                </div>
              ) : availableCoupons.map((c) => {
                const meetsMinOrder = subtotal >= (c.minOrderValue || 0);
                return (
                  <div
                    key={c.code}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                      meetsMinOrder
                        ? 'bg-slate-50 border-slate-200 hover:border-blue-300'
                        : 'bg-slate-50/50 border-slate-100 opacity-60'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-black text-[10px] uppercase tracking-wider">
                          {c.code}
                        </span>
                        {c.minOrderValue > 0 && !meetsMinOrder && (
                          <span className="text-[9px] text-amber-600 font-semibold">
                            Min ₹{c.minOrderValue}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-medium text-slate-700 line-clamp-1">
                        {c.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCode(c.code);
                        handleApplyCode(c.code);
                      }}
                      disabled={loading}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
