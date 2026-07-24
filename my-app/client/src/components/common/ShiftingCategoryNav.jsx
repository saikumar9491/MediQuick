import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ShiftingCategoryNav = ({ categories = [] }) => {
  return (
    <nav className="hidden border-b border-slate-150 bg-white sm:block px-4 sm:px-6 lg:px-8 relative z-40">
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

        {/* Animated underline indicator */}
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
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute top-full z-[100] mt-1.5 w-64 bg-white text-slate-900 p-5 rounded-2xl shadow-xl border border-slate-200/80 ${positionClass}`}
          >
            {/* Invisible Hover Bridge */}
            <div className="absolute -top-5 left-0 right-0 h-5 bg-transparent" />

            {/* Top Pointer Triangle */}
            <div className={`absolute top-0 h-3.5 w-3.5 -translate-y-1/2 rotate-45 border-t border-l border-slate-200 bg-white ${nubClass}`} />

            {/* Vertical Flyout Card Content (Matching User Design) */}
            <div className="text-left">
              {/* Category Header */}
              <div className="mb-3 border-b border-slate-100 pb-2">
                <h3 className="text-xs font-black text-[#0057FF] uppercase tracking-wider">
                  {name}
                </h3>
              </div>

              {/* Subcategories List */}
              {subOptions.length > 0 ? (
                <div className="space-y-1 mb-4 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                  {subOptions.map((sub, i) => {
                    const subName = typeof sub === 'object' ? sub.name : sub;
                    const subPath = typeof sub === 'object' 
                      ? sub.path 
                      : `/medicines?category=${encodeURIComponent(name)}&subCategory=${encodeURIComponent(subName)}`;

                    return (
                      <Link
                        key={i}
                        to={subPath}
                        className="block text-xs font-semibold text-slate-650 hover:text-[#0057FF] hover:translate-x-0.5 transition-all py-1"
                      >
                        {subName}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="py-3 text-[11px] font-medium text-slate-400">
                  Explore {name} products
                </div>
              )}

              {/* Bottom CTA Button */}
              <Link
                to={path || `/medicines?category=${encodeURIComponent(name)}`}
                className="w-full mt-2 rounded-xl border-2 border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-white px-4 py-2 text-xs font-extrabold transition-all text-center flex items-center justify-center gap-1 active:scale-95 shadow-2xs"
              >
                <span>View All Products</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShiftingCategoryNav;
