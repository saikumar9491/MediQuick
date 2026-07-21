import React from 'react';
import { ShoppingBag, Zap, Shield, Clock, Star } from 'lucide-react';

const PromoImagePanel = () => {
  const features = [
    { icon: <Zap size={14} />, text: '10-Minute Delivery' },
    { icon: <Shield size={14} />, text: '100% Genuine Medicines' },
    { icon: <Clock size={14} />, text: '24/7 Expert Support' },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #003d3e 50%, #00a2a4 100%)' }}>
      {/* Animated background image */}
      <img
        src="/auth-panel-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-luminosity"
      />

      {/* Decorative circles */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #00a2a4, transparent)' }} />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #00a2a4, transparent)' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, white, transparent)' }} />

      {/* Floating pill shapes */}
      <div className="absolute top-16 right-8 w-16 h-7 rounded-full opacity-20 rotate-45" style={{ background: 'linear-gradient(90deg, #00a2a4, #7dd3d4)' }} />
      <div className="absolute top-32 right-16 w-10 h-4 rounded-full opacity-15 -rotate-12" style={{ background: 'linear-gradient(90deg, white, #b2e8e8)' }} />
      <div className="absolute top-48 right-6 w-12 h-5 rounded-full opacity-20 rotate-30" style={{ background: 'linear-gradient(90deg, #00a2a4, white)' }} />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-8">
        {/* Top: Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg, #00a2a4, #007b7d)' }}>
            <ShoppingBag size={18} strokeWidth={3} color="white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase">
            MEDI<span style={{ color: '#00d4d6' }}>QUICK</span>
          </span>
        </div>

        {/* Middle: Star rating */}
        <div className="flex flex-col items-start gap-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="#FFD700" color="#FFD700" />
            ))}
          </div>
          <p className="text-sm text-white/70 font-medium italic">
            "Medicines at my door in 8 minutes. Absolutely incredible!"
          </p>
          <p className="text-xs font-bold text-white/50">— Priya S., Delhi</p>
        </div>

        {/* Bottom: Feature pills + CTA */}
        <div className="space-y-5">
          {/* Feature pills */}
          <div className="flex flex-col gap-2.5">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 rounded-xl px-4 py-2.5"
                style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <span style={{ color: '#00d4d6' }}>{f.icon}</span>
                <span className="text-sm font-semibold text-white">{f.text}</span>
              </div>
            ))}
          </div>

          {/* Bottom promo */}
          <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, rgba(0,162,164,0.4), rgba(0,162,164,0.1))', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,212,214,0.3)' }}>
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#00d4d6' }}>🎉 New Member Offer</p>
            <p className="text-2xl font-black text-white mt-1">FREE DELIVERY</p>
            <p className="text-xs text-white/60 mt-0.5">On your first 3 orders</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoImagePanel;
