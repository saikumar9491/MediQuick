import React from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Scissors, 
  Leaf, 
  Dumbbell, 
  Activity, 
  Heart, 
  Dog,
  ShieldCheck
} from 'lucide-react';

const CategoryTabBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'for-you', label: 'For You', icon: Sparkles, tint: 'bg-[#0057FF]/10 text-[#0057FF]' },
    { id: 'medicines', label: 'Medicines', icon: ShoppingBag, filter: '', tint: 'bg-[#0057FF]/10 text-[#0057FF]' },
    { id: 'skin-care', label: 'Skin Care', icon: Sparkles, filter: 'skin-care', tint: 'bg-[#16A34A]/10 text-[#16A34A]' },
    { id: 'hair-care', label: 'Hair Care', icon: Scissors, filter: 'hair-care', tint: 'bg-[#0057FF]/10 text-[#0057FF]' },
    { id: 'ayurveda', label: 'Ayurveda', icon: Leaf, filter: 'ayurveda', tint: 'bg-[#16A34A]/10 text-[#16A34A]' },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell, filter: 'fitness', tint: 'bg-[#FF6B00]/10 text-[#FF6B00]' },
    { id: 'wellness', label: 'Wellness', icon: Activity, filter: 'immunity', tint: 'bg-[#16A34A]/10 text-[#16A34A]' },
    { id: 'sexual-wellness', label: 'Sexual', icon: Heart, filter: 'sexual-wellness', tint: 'bg-[#EF4444]/10 text-[#EF4444]' }
  ];

  return (
    <div className="fixed top-28 left-0 right-0 z-30 bg-white border-b border-slate-150 h-16 flex items-center overflow-x-auto whitespace-nowrap scrollbar-none px-4 gap-5">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id, tab.filter)}
            className="flex flex-col items-center gap-1 shrink-0 h-full justify-center relative px-1 transition-all"
          >
            <div className={`p-1.5 rounded-full transition-colors ${
              isActive ? tab.tint : 'bg-slate-100 text-slate-500'
            }`}>
              <Icon size={18} className={isActive ? 'fill-current' : ''} />
            </div>
            <span className={`text-[10px] font-bold tracking-tight uppercase ${
              isActive ? 'text-[#0057FF] font-black' : 'text-slate-500'
            }`}>
              {tab.label}
            </span>
            {isActive && (
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#0057FF] rounded-t-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabBar;
