import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Clock, ChevronRight } from 'lucide-react';
import { API_BASE } from '../../utils/apiConfig';
import { MobileProductCard } from './ProductScrollRow';

const FlashDealsRow = () => {
  const [flashProducts, setFlashProducts] = useState([]);
  const [activeFlashCoupon, setActiveFlashCoupon] = useState(null);
  const [timeLeft, setTimeLeft] = useState('08h : 42m : 15s');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashData = async () => {
      try {
        // 1. Fetch active coupons
        const couponRes = await fetch(`${API_BASE}/api/coupons/public/active`);
        if (couponRes.ok) {
          const coupons = await couponRes.json();
          const flashCoupon = coupons.find(c => 
            (c.code || '').includes('FLASH') || 
            (c.code || '').includes('SALE') || 
            (c.code || '').includes('DEAL')
          );
          if (flashCoupon) setActiveFlashCoupon(flashCoupon);
        }

        // 2. Fetch flash medicines
        const medRes = await fetch(`${API_BASE}/api/medicines`);
        if (medRes.ok) {
          const medicines = await medRes.json();
          const list = Array.isArray(medicines) ? medicines : (medicines.medicines || []);
          const flashMeds = list.filter(m => m.isFlashDeal && m.isActive !== false);
          setFlashProducts(flashMeds);
        }
      } catch (err) {
        console.error("Error loading flash sale data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashData();
  }, []);

  // Live countdown timer logic (counts down to coupon validTo or end of day)
  useEffect(() => {
    const timer = setInterval(() => {
      const targetTime = activeFlashCoupon?.validTo 
        ? new Date(activeFlashCoupon.validTo).getTime()
        : new Date().setHours(23, 59, 59, 999);

      const difference = targetTime - Date.now();
      
      if (difference <= 0) {
        setTimeLeft('00h : 00m : 00s');
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const pad = (num) => String(num).padStart(2, '0');
      setTimeLeft(`${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeFlashCoupon]);

  if (loading || flashProducts.length === 0) return null;

  return (
    <div className="bg-white py-3.5 px-4 border-b border-slate-100 space-y-3.5">
      {/* Header with Title and Countdown */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-[#FF6B00] text-white p-1.5 rounded-xl animate-pulse">
            <Zap size={16} className="fill-current" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Flash Deals</h3>
              <span className="text-[8px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
                LIVE
              </span>
            </div>
            <span className="text-[9px] font-black text-[#FF6B00] uppercase tracking-widest bg-orange-50 border border-orange-100/60 px-1.5 py-0.5 rounded-md w-fit mt-0.5">
              {activeFlashCoupon ? `Code: ${activeFlashCoupon.code}` : 'UP TO 30% OFF'}
            </span>
          </div>
        </div>

        {/* Ticking Countdown Timer */}
        <Link 
          to="/medicines?filter=flash"
          className="flex items-center gap-2"
        >
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#FF6B00] to-[#EF4444] text-white px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-black shadow-2xs">
            <Clock size={12} className="text-white" />
            <span>{timeLeft}</span>
          </div>
        </Link>
      </div>

      {/* Product List Horizontal Scroll */}
      <div className="flex overflow-x-auto gap-3 pb-1 scrollbar-none snap-x">
        {flashProducts.map((product) => (
          <div key={product._id} className="snap-start shrink-0">
            <MobileProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashDealsRow;
