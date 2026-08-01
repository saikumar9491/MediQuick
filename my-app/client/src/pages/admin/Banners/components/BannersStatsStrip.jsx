import React from 'react';
import { Layers, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const BannersStatsStrip = ({ stats = {}, loading = false }) => {
  const cards = [
    {
      label: 'Total Banners',
      value: stats.totalBanners || 0,
      icon: Layers,
      iconBg: 'bg-blue-50 text-[#0057FF]',
      border: 'border-blue-100'
    },
    {
      label: 'Active Banners',
      value: stats.activeBanners || 0,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100'
    },
    {
      label: 'Scheduled Banners',
      value: stats.scheduledBanners || 0,
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100'
    },
    {
      label: 'Expired Banners',
      value: stats.expiredBanners || 0,
      icon: AlertTriangle,
      iconBg: 'bg-rose-50 text-rose-600',
      border: 'border-rose-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className={`bg-white rounded-xl p-4 border ${card.border} shadow-xs flex items-center justify-between transition-all hover:shadow-md`}
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {card.label}
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {loading ? (
                  <span className="inline-block h-6 w-12 animate-pulse bg-slate-100 rounded" />
                ) : (
                  card.value
                )}
              </h3>
            </div>
            <div className={`p-3 rounded-xl ${card.iconBg}`}>
              <IconComponent size={22} strokeWidth={2.5} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BannersStatsStrip;
