import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ShiftingCategoryNav = ({ categories = [] }) => {
  return (
    <nav className="hidden border-b border-slate-100 bg-white sm:block px-4 sm:px-6 lg:px-8 relative z-40">
      <div className="mx-auto flex max-w-[1440px] items-center justify-center gap-3 relative">
        {categories.map((cat, idx) => (
          <FlyoutCategoryLink key={cat.name || idx} category={cat} isFirst={idx === 0} isLast={idx === categories.length - 1} />
        ))}
      </div>
    </nav>
  );
};

const FlyoutCategoryLink = ({ category, isFirst, isLast }) => {
  const [open, setOpen] = useState(false);

  const name = category.name || '';
  const path = category.path || '#';
  const subOptions = category.subOptions || [];

  // Align leftmost dropdowns slightly right and rightmost dropdowns slightly left
  const positionClass = isFirst 
    ? 'left-0 translate-x-0' 
    : isLast 
      ? 'right-0 translate-x-0 left-auto' 
      : 'left-1/2 -translate-x-1/2';

  const nubClass = isFirst 
    ? 'left-8' 
    : isLast 
      ? 'right-8' 
      : 'left-1/2 -translate-x-1/2';

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative w-fit h-fit py-2.5"
    >
      <Link
        to={path}
        className={`relative flex items-center gap-1 text-[12.5px] font-bold transition-all px-2.5 py-1 rounded-full cursor-pointer ${
          open ? 'text-[#0057FF]' : 'text-slate-700 hover:text-[#0057FF]'
        }`}
      >
        <span>{name}</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${
            open ? 'rotate-180 text-[#0057FF]' : 'text-slate-400'
          }`}
        />

        {/* Underline scale animation */}
        <span
          style={{
            transform: open ? 'scaleX(1)' : 'scaleX(0)',
          }}
          className="absolute -bottom-0.5 left-2 right-2 h-[2px] origin-left rounded-full bg-[#0057FF] transition-transform duration-300 ease-out"
        />
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`absolute top-full z-[100] mt-1.5 w-[480px] rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xl ${positionClass}`}
          >
            {/* Invisible Hover Bridge */}
            <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent" />

            {/* Top Pointer Triangle */}
            <div className={`absolute top-0 h-3.5 w-3.5 -translate-y-1/2 rotate-45 rounded-tl border-t border-l border-slate-200 bg-white ${nubClass}`} />

            {/* Dropdown Content Grid */}
            <div className="grid grid-cols-12 gap-4 text-left">
              {/* Subcategories List */}
              <div className="col-span-7 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#0057FF]">
                    {name}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 font-[IBM_Plex_Mono]">
                    {subOptions.length} subcategories
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                  {subOptions.map((sub, i) => {
                    const subName = typeof sub === 'object' ? sub.name : sub;
                    const subPath = typeof sub === 'object' 
                      ? sub.path 
                      : `/medicines?category=${encodeURIComponent(name)}&subCategory=${encodeURIComponent(subName)}`;

                    return (
                      <Link
                        key={i}
                        to={subPath}
                        className="group flex items-center justify-between p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#0057FF]/5 hover:text-[#0057FF] transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-5.5 h-5.5 rounded-md bg-slate-100 text-slate-500 group-hover:bg-[#0057FF] group-hover:text-white flex items-center justify-center transition-colors">
                            <Sparkles size={11} />
                          </div>
                          <span className="truncate max-w-[170px]">{subName}</span>
                        </div>
                        <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#0057FF]" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Promo Card Right Panel */}
              <div className="col-span-5 bg-gradient-to-br from-slate-900 via-[#0a1f3d] to-[#0057FF] rounded-xl p-3.5 text-white flex flex-col justify-between relative overflow-hidden shadow-xs">
                <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-white/10 blur-md pointer-events-none" />
                <div className="space-y-1.5 z-10">
                  <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-blue-200">
                    <ShieldCheck size={10} />
                    <span>MediQuick Verified</span>
                  </div>
                  <h4 className="text-xs font-black tracking-tight leading-tight">
                    Authentic {name}
                  </h4>
                  <p className="text-[9.5px] text-slate-300 leading-snug line-clamp-2">
                    100% genuine certified healthcare products.
                  </p>
                </div>

                <Link
                  to={path || `/medicines?category=${encodeURIComponent(name)}`}
                  className="mt-3 inline-flex items-center justify-center gap-1 bg-[#FF6B00] hover:bg-[#E55A00] text-white text-[9.5px] font-black uppercase tracking-wider py-1.5 px-3 rounded-lg shadow-xs active:scale-95 transition-all z-10"
                >
                  <span>Shop Now</span>
                  <ArrowRight size={10} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShiftingCategoryNav;
