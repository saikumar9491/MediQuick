import React, { useState } from 'react';

/**
 * @description Advanced Care Plan Page with Compact Hero
 * Unique Features: Comparison Table, Animated Glassmorphism, and Interactive FAQ.
 */
const CarePlanPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const benefits = [
    { id: 1, title: "Extra 5% Off", desc: "Stacks with all other coupons and deals.", icon: "💎" },
    { id: 2, title: "Zero Delivery", desc: "No minimum order value for Care members.", icon: "⚡" },
    { id: 3, title: "Priority Lab", desc: "Reports delivered 4 hours faster than standard.", icon: "🔬" },
    { id: 4, title: "Free Follow-ups", desc: "Unlimited chat with doctors after consultation.", icon: "💬" }
  ];

  const faqs = [
    { q: "Is it valid for all medicines?", a: "Yes, the extra 5% discount applies to all prescription and OTC products." },
    { q: "Can I cancel my membership?", a: "You can cancel anytime, though the annual fee is non-refundable." }
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* 1. COMPACT ULTRA-PREMIUM HERO */}
        <div className="relative rounded-[3rem] bg-slate-900 p-8 md:p-12 text-white mb-12 shadow-2xl overflow-hidden">
          {/* Subtle Animated Glows */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-red-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500/10 rounded-full blur-[80px]" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-4 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
              <span className="animate-pulse w-1.5 h-1.5 bg-red-500 rounded-full" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Amritsar Hub Premium</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-6">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-300">Ultimate</span> Save.
            </h1>
            
            <p className="text-base font-medium italic opacity-70 max-w-xl mb-8 leading-relaxed">
              MediQuick+ Care: Your lifestyle of wellness and massive savings starts here.
            </p>

            <button className="group relative bg-red-600 hover:bg-red-500 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_15px_40px_rgba(220,38,38,0.2)] hover:-translate-y-0.5">
              Join @ ₹199/year
            </button>
          </div>
        </div>

        {/* 2. FLOATING BENEFITS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {benefits.map((b) => (
            <div key={b.id} className="group relative bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 transition-all hover:bg-white hover:shadow-xl">
              <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-500">{b.icon}</div>
              <h3 className="text-lg font-black italic uppercase tracking-tighter text-slate-800 mb-2">{b.title}</h3>
              <p className="text-[11px] font-bold text-slate-400 leading-tight">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* 3. COMPARISON SECTION */}
        <div className="mb-20">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-center mb-10">Comparison <span className="text-slate-300 italic">Hub</span></h2>
          <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] border border-slate-100 shadow-lg overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-5 text-[9px] font-black uppercase text-slate-400">Benefits</th>
                  <th className="p-5 text-[9px] font-black uppercase text-slate-400 text-center">Guest</th>
                  <th className="p-5 text-[9px] font-black uppercase text-red-600 text-center bg-red-50/50">Care</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-bold">
                <tr className="border-b border-slate-50">
                  <td className="p-5">Medicine Discount</td>
                  <td className="p-5 text-center">20%</td>
                  <td className="p-5 text-center bg-red-50/20 text-red-600 font-black italic">25% Flat</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="p-5">Lab Test Discount</td>
                  <td className="p-5 text-center">60%</td>
                  <td className="p-5 text-center bg-red-50/20 text-red-600 font-black italic">70% Flat</td>
                </tr>
                <tr>
                  <td className="p-5">Support Speed</td>
                  <td className="p-5 text-center text-slate-300">24 Hours</td>
                  <td className="p-5 text-center bg-red-50/20 text-red-600 font-black italic">Instant</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. INTERACTIVE FAQ */}
        <div className="max-w-xl mx-auto">
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div 
                key={i} 
                className="bg-slate-50 rounded-xl p-5 cursor-pointer border border-slate-100 transition-all hover:bg-slate-100"
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black uppercase tracking-tight">{f.q}</span>
                  <span className="text-slate-400 text-lg leading-none">{activeFaq === i ? '−' : '+'}</span>
                </div>
                {activeFaq === i && (
                  <p className="mt-3 text-[10px] font-bold text-slate-500 animate-fadeIn">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default CarePlanPage;