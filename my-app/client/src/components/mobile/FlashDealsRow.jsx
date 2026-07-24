import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Clock } from 'lucide-react';
import { API_BASE } from '../../utils/apiConfig';
import { MobileProductCard } from './ProductScrollRow';

const FlashDealsRow = () => {
  const [flashProducts, setFlashProducts] = useState([]);
  const [activeFlashCoupon, setActiveFlashCoupon] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashData = async () => {
      try {
        // 1. Fetch active coupons
        const couponRes = await fetch(`${API_BASE}/api/coupons/public/active`);
        let flashCoupon = null;
        if (couponRes.ok) {
          const coupons = await couponRes.json();
          // Find coupon whose code contains FLASH, SALE, or DEAL
          flashCoupon = coupons.find(c => 
            c.code.includes('FLASH') || 
            c.code.includes('SALE') || 
            c.code.includes('DEAL')
          );
        }

        // 2. Fetch medicines
        const medRes = await fetch(`${API_BASE}/api/medicines`);
        let flashMeds = [];
        if (medRes.ok) {
          const medicines = await medRes.json();
          const list = Array.isArray(medicines) ? medicines : (medicines.medicines || []);
          flashMeds = list.filter(m => m.isFlashDeal && m.isActive !== false);
        }

        if (flashCoupon && flashMeds.length > 0) {
          setActiveFlashCoupon(flashCoupon);
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

  // Countdown timer logic
  useEffect(() => {
    if (!activeFlashCoupon) return;

    const timer = setInterval(() => {
      const difference = new Date(activeFlashCoupon.validTo).getTime() - Date.now();
      
      if (difference <= 0) {
        setTimeLeft('Expired');
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const pad = (num) => String(num).padStart(2, '0');
      setTimeLeft(`${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeFlashCoupon]);

  if (loading || !activeFlashCoupon || flashProducts.length === 0) return null;

  return (
    <div className="bg-white py-4 px-4 border-b border-slate-100 space-y-4">
      {/* Header with Title and Countdown */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-[#FF6B00] text-white p-1.5 rounded-xl">
            <Zap size={15} className="fill-current" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Flash Deals</h3>
            <span className="text-[9px] font-black text-[#FF6B00] uppercase tracking-widest bg-orange-50 border border-orange-100/60 px-1.5 py-0.5 rounded-md w-fit mt-0.5">
              Code: {activeFlashCoupon.code}
            </span>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-1.5 bg-[#FF6B00] text-white px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-black shadow-xs">
          <Clock size={11} className="text-white" />
          <span>{timeLeft}</span>
        </div>
      </div>

      {/* Product List */}
      <div className="flex overflow-x-auto gap-3.5 pb-2.5 scrollbar-none snap-x">
        {flashProducts.map((product) => (
          <div key={product._id} className="snap-start">
            <MobileProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashDealsRow;
