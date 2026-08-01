import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import MedicineCard from '../medicine/MedicineCard';
import { API_BASE } from '../../utils/apiConfig';

const DesktopFlashDealsSection = ({ medicines = [] }) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [flashProducts, setFlashProducts] = useState([]);
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [timeLeft, setTimeLeft] = useState('08h : 42m : 15s');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check passed props first
    const propDeals = medicines.filter(m => m.isFlashDeal && m.isActive !== false);
    if (propDeals.length > 0) {
      setFlashProducts(propDeals);
      setLoading(false);
    }

    const fetchFlashData = async () => {
      try {
        // Fetch active coupons
        const couponRes = await fetch(`${API_BASE}/api/coupons/public/active`);
        if (couponRes.ok) {
          const coupons = await couponRes.json();
          const flashCoupon = coupons.find(c => 
            (c.code || '').includes('FLASH') || 
            (c.code || '').includes('SALE') || 
            (c.code || '').includes('DEAL')
          );
          if (flashCoupon) setActiveCoupon(flashCoupon);
        }

        // Fetch flash medicines from API if prop was empty or to sync latest
        if (propDeals.length === 0) {
          const medRes = await fetch(`${API_BASE}/api/medicines`);
          if (medRes.ok) {
            const data = await medRes.json();
            const list = Array.isArray(data) ? data : (data.medicines || []);
            const flashMeds = list.filter(m => m.isFlashDeal && m.isActive !== false);
            setFlashProducts(flashMeds);
          }
        }
      } catch (err) {
        console.error('Error loading desktop flash deals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashData();
  }, [medicines]);

  // Live countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      const targetTime = activeCoupon?.validTo 
        ? new Date(activeCoupon.validTo).getTime()
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
  }, [activeCoupon]);

  if (loading || flashProducts.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-amber-50/40 via-white to-white py-8 border-y border-amber-100/60 my-4">
      <div className="mx-auto max-w-[1400px] px-4 md:px-5">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#FF6B00] text-white p-2.5 rounded-2xl shadow-md animate-pulse">
              <Zap size={22} className="fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">
                  Flash Deals
                </h2>
                <span className="text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse shadow-2xs">
                  LIVE
                </span>
                <span className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest bg-orange-100/80 border border-orange-200 px-2 py-0.5 rounded-md">
                  {activeCoupon ? `Code: ${activeCoupon.code}` : 'UP TO 30% OFF'}
                </span>
              </div>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">
                Limited-time discounts on top pharmaceutical essentials
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Ticking Timer */}
            <div className="flex items-center gap-2 bg-slate-900 text-white px-3.5 py-1.5 rounded-xl shadow-sm border border-slate-800">
              <Clock size={14} className="text-[#FF6B00]" />
              <span className="text-xs font-mono font-black tracking-wider text-amber-300">
                {timeLeft}
              </span>
            </div>

            {/* Navigation Arrow Controls */}
            <div className="hidden md:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollRef.current?.scrollBy({ left: -440, behavior: 'smooth' })}
                className="h-9 w-9 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-[#0057FF] hover:text-white hover:border-transparent transition-all flex items-center justify-center shadow-xs cursor-pointer active:scale-95"
                title="Scroll Left"
              >
                <ChevronLeft size={18} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => scrollRef.current?.scrollBy({ left: 440, behavior: 'smooth' })}
                className="h-9 w-9 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-[#0057FF] hover:text-white hover:border-transparent transition-all flex items-center justify-center shadow-xs cursor-pointer active:scale-95"
                title="Scroll Right"
              >
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </div>

            <button 
              onClick={() => navigate('/medicines?isFlashDeal=true')} 
              className="flex items-center gap-1 text-[#0057FF] hover:text-blue-700 font-bold text-xs md:text-sm transition-colors uppercase tracking-wider ml-1 cursor-pointer"
            >
              See all <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Product Cards Row */}
        <div className="relative group">
          <div 
            ref={scrollRef}
            className="flex items-stretch gap-4 md:gap-6 overflow-x-auto pt-2 pb-4 scroll-smooth md:px-1 custom-scrollbar-hidden"
          >
            {flashProducts.map((med) => (
              <div key={med._id} className="min-w-[160px] max-w-[160px] md:min-w-[220px] md:max-w-[220px] flex shrink-0">
                <MedicineCard {...med} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default DesktopFlashDealsSection;
