import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown,
  ArrowRight,
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
  ShoppingBag
} from 'lucide-react';

const iconMap = {
  Pill, Leaf, Activity, Apple, Heart, Shield, Baby, Dog,
  BookOpen, Stethoscope, Dumbbell, Sparkles, FlaskConical,
  Scissors, Smile, Layers, LayoutGrid, ShoppingBag
};

// Premium curated gradient palette for category cards
const cardGradients = [
  {
    bg: 'from-violet-600 via-purple-600 to-indigo-700',
    light: 'from-violet-50 to-purple-50',
    accent: '#7c3aed',
    badge: 'bg-white/20 text-white',
    iconBg: 'bg-white/20',
    hover: 'hover:shadow-violet-200'
  },
  {
    bg: 'from-teal-500 via-[#00a2a4] to-emerald-600',
    light: 'from-teal-50 to-emerald-50',
    accent: '#00a2a4',
    badge: 'bg-white/20 text-white',
    iconBg: 'bg-white/20',
    hover: 'hover:shadow-teal-200'
  },
  {
    bg: 'from-rose-500 via-pink-600 to-red-500',
    light: 'from-rose-50 to-pink-50',
    accent: '#e11d48',
    badge: 'bg-white/20 text-white',
    iconBg: 'bg-white/20',
    hover: 'hover:shadow-rose-200'
  },
  {
    bg: 'from-amber-500 via-orange-500 to-yellow-500',
    light: 'from-amber-50 to-orange-50',
    accent: '#d97706',
    badge: 'bg-white/20 text-white',
    iconBg: 'bg-white/20',
    hover: 'hover:shadow-amber-200'
  },
  {
    bg: 'from-blue-600 via-sky-500 to-cyan-500',
    light: 'from-blue-50 to-sky-50',
    accent: '#0284c7',
    badge: 'bg-white/20 text-white',
    iconBg: 'bg-white/20',
    hover: 'hover:shadow-blue-200'
  },
  {
    bg: 'from-green-500 via-emerald-500 to-teal-500',
    light: 'from-green-50 to-emerald-50',
    accent: '#10b981',
    badge: 'bg-white/20 text-white',
    iconBg: 'bg-white/20',
    hover: 'hover:shadow-emerald-200'
  },
  {
    bg: 'from-slate-700 via-slate-600 to-slate-800',
    light: 'from-slate-50 to-slate-100',
    accent: '#475569',
    badge: 'bg-white/20 text-white',
    iconBg: 'bg-white/20',
    hover: 'hover:shadow-slate-200'
  },
  {
    bg: 'from-fuchsia-500 via-purple-500 to-pink-500',
    light: 'from-fuchsia-50 to-pink-50',
    accent: '#a21caf',
    badge: 'bg-white/20 text-white',
    iconBg: 'bg-white/20',
    hover: 'hover:shadow-fuchsia-200'
  },
  {
    bg: 'from-lime-500 via-green-500 to-emerald-600',
    light: 'from-lime-50 to-green-50',
    accent: '#65a30d',
    badge: 'bg-white/20 text-white',
    iconBg: 'bg-white/20',
    hover: 'hover:shadow-lime-200'
  },
];

const THEMED_ROUTES = {
  'ayurveda': '/ayurveda',
  'lab tests': '/lab-tests',
  'diagnostics': '/lab-tests',
  'doctor consultations': '/consult',
  'consult top doctors': '/consult',
};

const CategoryCard = ({ category, index }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const IconComponent = iconMap[category.iconName] || ShoppingBag;
  const palette = cardGradients[index % cardGradients.length];

  const subOptions = category.subOptions || [];
  const previewSubs = subOptions.slice(0, 4);
  const remainingCount = subOptions.length - previewSubs.length;

  const handleCategoryClick = () => {
    const nameLower = (category.name || '').toLowerCase().trim();
    const themed = THEMED_ROUTES[nameLower];
    if (themed) {
      navigate(themed);
    } else {
      navigate(`/medicines?category=${encodeURIComponent(category.name)}`);
    }
  };

  const handleSubClick = (e, subName) => {
    e.stopPropagation();
    navigate(`/medicines?category=${encodeURIComponent(category.name)}&subCategory=${encodeURIComponent(subName)}`);
  };

  if (category.count === 0) return null; // hide zero-stock categories

  return (
    <div
      className={`group relative overflow-hidden rounded-[20px] sm:rounded-[28px] border border-white/60 shadow-[0_10px_45px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-500 bg-white cursor-pointer flex flex-col ${palette.hover}`}
      style={{ transform: 'translateZ(0)' }}
    >
      {/* Gradient Hero Top Section */}
      <div
        onClick={handleCategoryClick}
        className={`relative bg-gradient-to-br ${palette.bg} p-3.5 pt-4.5 sm:p-6 sm:pt-7 overflow-hidden`}
      >
        {/* Decorative circle blobs */}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-black/10 blur-lg" />

        <div className="relative z-10 flex items-start justify-between gap-1.5 flex-wrap">
          <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${palette.iconBg} flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-sm`}>
            <IconComponent className="text-white h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          <span className={`${palette.badge} backdrop-blur-sm text-[8px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/20 flex-shrink-0`}>
            {category.count} Items
          </span>
        </div>

        <div className="relative z-10 mt-3 sm:mt-4">
          <h3 className="text-sm sm:text-lg font-bold text-white tracking-tight leading-tight" style={{ letterSpacing: '-0.01em' }}>
            {category.name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-5 space-y-3.5">
        
        {/* Subcategory Preview Pills */}
        {previewSubs.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {previewSubs.map((sub, i) => {
              const subName = typeof sub === 'object' ? sub.name : sub;
              return (
                <button
                  key={i}
                  onClick={(e) => handleSubClick(e, subName)}
                  className="px-2 py-0.5 rounded-lg text-[9px] sm:text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-100/80 hover:border-[#00a2a4]/30 hover:text-[#00a2a4] hover:bg-[#00a2a4]/5 transition-all cursor-pointer truncate max-w-[110px]"
                >
                  {subName}
                </button>
              );
            })}
            {remainingCount > 0 && (
              <span className="px-2 py-0.5 rounded-lg text-[9px] sm:text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-100/80">
                +{remainingCount}
              </span>
            )}
          </div>
        )}

        {/* Expandable Accordion */}
        {subOptions.length > 4 && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-between w-full text-left text-[9px] sm:text-[11px] font-bold text-slate-400 hover:text-[#00a2a4] transition-colors cursor-pointer py-0.5"
            >
              <span>{expanded ? 'Hide options' : `All ${subOptions.length} subcats`}</span>
              <ChevronDown size={12} className={`transition-transform duration-300 ${expanded ? 'rotate-180 text-[#00a2a4]' : ''}`} />
            </button>

            {expanded && (
              <div className="mt-2 pt-2 border-t border-slate-100 space-y-1 max-h-36 overflow-y-auto pr-1">
                {subOptions.map((sub, i) => {
                  const subName = typeof sub === 'object' ? sub.name : sub;
                  const subCount = typeof sub === 'object' ? sub.count : 0;
                  return (
                    <button
                      key={i}
                      onClick={(e) => handleSubClick(e, subName)}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-[11px] font-medium text-slate-650 hover:bg-slate-50 hover:text-[#00a2a4] flex items-center justify-between transition-all cursor-pointer"
                    >
                      <span className="truncate">{subName}</span>
                      {subCount > 0 && (
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full ml-1 flex-shrink-0">
                          {subCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* CTA Button — pushes to bottom */}
        <div className="mt-auto pt-1">
          <button
            onClick={handleCategoryClick}
            className={`group/btn w-full py-2 rounded-full text-[10px] sm:text-xs font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 bg-gradient-to-r ${palette.bg} text-white shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99]`}
          >
            <span>Explore</span>
            <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
