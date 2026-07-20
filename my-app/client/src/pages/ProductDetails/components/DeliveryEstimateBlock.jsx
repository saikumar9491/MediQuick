import React, { useState, useEffect } from 'react';
import { Truck, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { API_BASE } from '../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const DeliveryEstimateBlock = () => {
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isServiceable, setIsServiceable] = useState(null); // null = not yet checked
  const [cutoffTimestamp, setCutoffTimestamp] = useState(null);
  const [countdownString, setCountdownString] = useState('');
  const [checking, setChecking] = useState(false);

  // Pre-fill input with saved pincode (but do NOT auto-check)
  useEffect(() => {
    const saved = localStorage.getItem('userPincode');
    if (saved) setPincode(saved);

    const handleLocationChange = () => {
      const fresh = localStorage.getItem('userPincode');
      if (fresh) {
        setPincode(fresh);
        // Reset result so user sees the new pincode but must click Check
        setIsServiceable(null);
        setDeliveryInfo(null);
        setCutoffTimestamp(null);
      }
    };

    window.addEventListener('locationChanged', handleLocationChange);
    return () => window.removeEventListener('locationChanged', handleLocationChange);
  }, []);

  // Real-time countdown ticker
  useEffect(() => {
    if (!cutoffTimestamp) { setCountdownString(''); return; }
    const updateTimer = () => {
      const remainingMs = cutoffTimestamp - Date.now();
      if (remainingMs <= 0) { setCountdownString(''); return; }
      const totalSeconds = Math.floor(remainingMs / 1000);
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      setCountdownString(`${h}h ${m}m ${s}s`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [cutoffTimestamp]);

  const fetchDeliveryEstimate = async (targetPincode) => {
    setChecking(true);
    try {
      const res = await fetch(`${API_BASE}/api/delivery/estimate?pincode=${targetPincode}`);
      const data = await res.json();
      if (data.isServiceable) {
        setDeliveryInfo(data);
        setIsServiceable(true);
        setCutoffTimestamp(data.cutoffTime ? new Date(data.cutoffTime).getTime() : null);
        // Save successful pincode
        localStorage.setItem('userPincode', targetPincode);
      } else {
        setDeliveryInfo(null);
        setIsServiceable(false);
        setCutoffTimestamp(null);
      }
    } catch (err) {
      console.error('Error estimating delivery:', err);
      toast.error('Could not check delivery. Please try again.');
      setIsServiceable(null);
    } finally {
      setChecking(false);
    }
  };

  const handleCheck = () => {
    if (/^\d{6}$/.test(pincode)) {
      fetchDeliveryEstimate(pincode);
    } else {
      toast.error('Please enter a valid 6-digit pincode');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleCheck();
  };

  return (
    <div className="p-4 rounded-xl border border-slate-100 bg-[#F8FAFC]/60">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Truck size={13} className="text-slate-400" />
        <span className="text-[9px] font-medium uppercase tracking-widest text-slate-450">
          Check Serviceability
        </span>
      </div>

      {/* Input row */}
      <div className="flex bg-white rounded-lg overflow-hidden border border-slate-200/85 p-0.5 shadow-2xs">
        <div className="flex items-center flex-1 px-2.5 gap-1.5">
          <MapPin size={12} className="text-slate-350 flex-shrink-0" />
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter 6-digit pincode"
            value={pincode}
            onChange={(e) => {
              setPincode(e.target.value.replace(/\D/g, ''));
              // Clear previous result when user starts typing a new code
              if (isServiceable !== null) setIsServiceable(null);
            }}
            onKeyDown={handleKeyDown}
            maxLength={6}
            className="flex-1 py-1.5 text-xs font-medium text-slate-700 bg-transparent focus:outline-none placeholder-slate-350"
          />
        </div>
        <button
          onClick={handleCheck}
          disabled={checking}
          className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-600 text-xs font-medium rounded-md transition-colors"
        >
          {checking ? '...' : 'Check'}
        </button>
      </div>

      {/* Result */}
      {isServiceable === true && deliveryInfo && (
        <div className="mt-2.5 flex items-start gap-2">
          <CheckCircle size={13} className="text-emerald-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-slate-700">
              Delivery expected <span className="text-emerald-700">{deliveryInfo.deliveryDateString}</span>
              {deliveryInfo.hubName && (
                <span className="text-slate-400 font-normal"> · via {deliveryInfo.hubName}</span>
              )}
            </p>
            {countdownString && (
              <p className="text-[10px] text-slate-400">
                Order within <span className="text-slate-600 font-medium">{countdownString}</span> for this dispatch cycle
              </p>
            )}
          </div>
        </div>
      )}

      {isServiceable === false && (
        <div className="mt-2.5 flex items-start gap-2">
          <XCircle size={13} className="text-slate-350 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-400">
            We don't deliver to <span className="font-medium text-slate-500">{pincode}</span> yet.
            <span className="block text-[10px] mt-0.5 text-slate-350">
              Check back soon — we're expanding our delivery network.
            </span>
          </p>
        </div>
      )}

      {/* Idle hint — shown before user checks anything */}
      {isServiceable === null && (
        <p className="mt-2 text-[10px] text-slate-350">
          Enter your pincode to check if we deliver to your area.
        </p>
      )}
    </div>
  );
};
