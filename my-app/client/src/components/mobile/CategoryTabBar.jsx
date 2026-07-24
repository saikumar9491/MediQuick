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
    { id: 'for-you', label: 'For You', icon: Sparkles },
    { id: 'medicines', label: 'Medicines', icon: ShoppingBag, filter: '' },
    { id: 'skin-care', label: 'Skin Care', icon: Sparkles, filter: 'skin-care' },
    { id: 'hair-care', label: 'Hair Care', icon: Scissors, filter: 'hair-care' },
    { id: 'ayurveda', label: 'Ayurveda', icon: Leaf, filter: 'ayurveda' },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell, filter: 'fitness' },
    { id: 'wellness', label: 'Wellness', icon: Activity, filter: 'immunity' },
    { id: 'sexual-wellness', label: 'Sexual', icon: Heart, filter: 'sexual-wellness' },
    { id: 'pet-care', label: 'Pet Care', icon: Dog, filter: 'pet-care' },
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
              isActive ? 'bg-[#00a2a4]/10 text-[#00a2a4]' : 'text-slate-500'
            }`}>
              <Icon size={18} className={isActive ? 'fill-current' : ''} />
            </div>
            <span className={`text-[10px] font-bold tracking-tight uppercase ${
              isActive ? 'text-[#00a2a4] font-black' : 'text-slate-500'
            }`}>
              {tab.label}
            </span>
            {isActive && (
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#00a2a4] rounded-t-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabBar;
