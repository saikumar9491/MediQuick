import React from 'react';
import { 
  Pill, 
  Leaf, 
  Activity, 
  Apple, 
  Heart, 
  Shield, 
  Baby, 
  Dog, 
  BookOpen, 
  Stethoscope, 
  Dumbbell, 
  Sparkles, 
  FlaskConical, 
  Scissors, 
  Smile, 
  Layers, 
  LayoutGrid, 
  ShoppingBag,
  Flame,
  Sun,
  Crosshair,
  Zap
} from 'lucide-react';

const iconMap = {
  Pill, Leaf, Activity, Apple, Heart, Shield, Baby, Dog,
  BookOpen, Stethoscope, Dumbbell, Sparkles, FlaskConical,
  Scissors, Smile, Layers, LayoutGrid, ShoppingBag, Flame, Sun, Crosshair, Zap
};

// Preset colors for category icon tiles matching MediQuick color system
const getCategoryColorStyle = (name, index, isActive) => {
  if (isActive) {
    return {
      tileBg: 'bg-[#0057FF]',
      iconColor: 'text-white'
    };
  }

  const n = (name || '').toLowerCase();
  if (n.includes('medicine') || n.includes('pharmacy') || n.includes('first aid')) {
    return { tileBg: 'bg-blue-50', iconColor: 'text-[#0057FF]' };
  }
  if (n.includes('hair') || n.includes('beauty') || n.includes('skin') || n.includes('personal')) {
    return { tileBg: 'bg-orange-50', iconColor: 'text-[#FF6B00]' };
  }
  if (n.includes('fitness') || n.includes('ayurveda') || n.includes('herb') || n.includes('nutrition')) {
    return { tileBg: 'bg-emerald-50', iconColor: 'text-[#16A34A]' };
  }
  if (n.includes('pet') || n.includes('emergency') || n.includes('care') || n.includes('baby')) {
    return { tileBg: 'bg-red-50', iconColor: 'text-[#EF4444]' };
  }

  // Fallback round-robin palette
  const palettes = [
    { tileBg: 'bg-blue-50', iconColor: 'text-[#0057FF]' },
    { tileBg: 'bg-orange-50', iconColor: 'text-[#FF6B00]' },
    { tileBg: 'bg-emerald-50', iconColor: 'text-[#16A34A]' },
    { tileBg: 'bg-purple-50', iconColor: 'text-purple-600' },
  ];
  return palettes[index % palettes.length];
};

const CategoryLeftPanel = ({ 
  categories = [], 
  activeCategoryId, 
  onSelectCategory, 
  searchQuery = '' 
}) => {
  const filteredCategories = categories.filter(cat => 
    (cat.name || '').toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const flashTile = { _id: 'flash-deals-special', name: 'Flash Deals', iconName: 'Zap' };
  const displayCategories = [flashTile, ...filteredCategories];

  return (
    <div className="w-[68px] sm:w-[72px] bg-[#F8F9FA] border-r border-slate-200/70 overflow-y-auto flex-shrink-0 flex flex-col h-full no-scrollbar select-none">
      {displayCategories.map((cat, index) => {
        const isFlashTile = cat._id === 'flash-deals-special';
        const isActive = cat._id === activeCategoryId || cat.name === activeCategoryId;
        const IconComponent = isFlashTile ? Zap : (iconMap[cat.iconName] || LayoutGrid);
        
        let style = getCategoryColorStyle(cat.name, index, isActive);
        if (isFlashTile) {
          style = isActive 
            ? { tileBg: 'bg-[#FF6B00]', iconColor: 'text-white' } 
            : { tileBg: 'bg-orange-100/80', iconColor: 'text-[#FF6B00]' };
        }

        return (
          <button
            key={cat._id || cat.name}
            onClick={() => onSelectCategory(cat._id || cat.name)}
            className={`py-3 px-1 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative ${
              isActive 
                ? 'bg-white border-l-[2.5px] border-[#0057FF]' 
                : 'bg-[#F8F9FA] border-l-[2.5px] border-transparent hover:bg-slate-100/60'
            }`}
          >
            {/* 28x28px Icon Tile */}
            <div className={`w-[28px] h-[28px] rounded-lg flex items-center justify-center mb-1 shadow-2xs transition-transform ${style.tileBg} ${isActive ? 'scale-105' : ''}`}>
              <IconComponent className={`w-3.5 h-3.5 ${style.iconColor}`} />
            </div>

            {/* Category Name below */}
            <span className={`text-[7.5px] leading-tight text-center break-words w-full px-0.5 line-clamp-2 ${
              isActive 
                ? 'font-bold text-[#0057FF]' 
                : 'font-medium text-slate-500'
            }`}>
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryLeftPanel;
