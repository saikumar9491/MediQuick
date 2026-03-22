import React, { useState } from 'react';

/**
 * @description Advanced Care Plan Page with Compact Hero
 * Improved for better mobile responsiveness and cleaner spacing.
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
    <div className="min-h-screen overflow-hidden bg-white pb-12 pt-20 sm:pt-24 sm:pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Hero */}
        <div className="relative mb-10 sm:mb-12 overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] bg-slate-900 p-5 sm:p-8 md:p-12 text-white shadow-2xl">
          <div className="absolute right-0 top-0 h-52 w-52 sm:h-72 sm:w-72 rounded-full bg-red-600/10 blur-[80px] sm:blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 h-36 w-36 sm:h-48 sm:w-48 rounded-full bg-rose-500/10 blur-[60px] sm:blur-[80px]" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-4 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.18em] sm:tracking-[0.2em]">
                Amritsar Hub Premium
              </span>
            </div>

            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
              The{' '}
              <span className="bg-gradient-to-r from-red-400 to-rose-300 bg-clip-text text-transparent">
                Ultimate
              </span>{' '}
              Save.
            </h1>

            <p className="mb-6 sm:mb-8 max-w-xl text-sm sm:text-base font-medium italic leading-relaxed opacity-70">
              MediQuick+ Care: Your lifestyle of wellness and massive savings starts here.
            </p>

            <button className="group relative rounded-xl sm:rounded-2xl bg-red-600 px-6 sm:px-10 py-3 sm:py-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.18em] sm:tracking-widest text-white shadow-[0_15px_40px_rgba(220,38,38,0.2)] transition-all hover:-translate-y-0.5 hover:bg-red-500">
              Join @ ₹199/year
            </button>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-14 sm:mb-20 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div
              key={b.id}
              className="group relative rounded-[1.75rem] sm:rounded-[2.5rem] border border-slate-100 bg-slate-50 p-5 sm:p-6 transition-all hover:bg-white hover:shadow-xl"
            >
              <div className="mb-3 sm:mb-4 text-3xl sm:text-4xl grayscale transition-all duration-500 group-hover:grayscale-0">
                {b.icon}
              </div>
              <h3 className="mb-2 text-base sm:text-lg font-black uppercase italic tracking-tighter text-slate-800">
                {b.title}
              </h3>
              <p className="text-[10px] sm:text-[11px] font-bold leading-tight text-slate-400">
                {b.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Comparison */}
        <div className="mb-14 sm:mb-20">
          <h2 className="mb-6 sm:mb-10 text-center text-xl sm:text-2xl font-black uppercase italic tracking-tighter">
            Comparison <span className="italic text-slate-300">Hub</span>
          </h2>

          <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 bg-white shadow-lg">
            <div className="overflow-x-auto">
              <table className="min-w-[560px] w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="p-4 sm:p-5 text-[8px] sm:text-[9px] font-black uppercase text-slate-400">Benefits</th>
                    <th className="p-4 sm:p-5 text-center text-[8px] sm:text-[9px] font-black uppercase text-slate-400">Guest</th>
                    <th className="bg-red-50/50 p-4 sm:p-5 text-center text-[8px] sm:text-[9px] font-black uppercase text-red-600">Care</th>
                  </tr>
                </thead>
                <tbody className="text-[10px] sm:text-[11px] font-bold">
                  <tr className="border-b border-slate-50">
                    <td className="p-4 sm:p-5">Medicine Discount</td>
                    <td className="p-4 sm:p-5 text-center">20%</td>
                    <td className="bg-red-50/20 p-4 sm:p-5 text-center font-black italic text-red-600">25% Flat</td>
                  </tr>
                  <tr className="border-b border-slate-50">
                    <td className="p-4 sm:p-5">Lab Test Discount</td>
                    <td className="p-4 sm:p-5 text-center">60%</td>
                    <td className="bg-red-50/20 p-4 sm:p-5 text-center font-black italic text-red-600">70% Flat</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5">Support Speed</td>
                    <td className="p-4 sm:p-5 text-center text-slate-300">24 Hours</td>
                    <td className="bg-red-50/20 p-4 sm:p-5 text-center font-black italic text-red-600">Instant</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mx-auto max-w-xl">
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="cursor-pointer rounded-xl border border-slate-100 bg-slate-50 p-4 sm:p-5 transition-all hover:bg-slate-100"
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-tight">
                    {f.q}
                  </span>
                  <span className="text-lg leading-none text-slate-400">
                    {activeFaq === i ? '−' : '+'}
                  </span>
                </div>

                {activeFaq === i && (
                  <p className="mt-3 animate-fadeIn text-[10px] font-bold text-slate-500 sm:text-[11px]">
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CarePlanPage;