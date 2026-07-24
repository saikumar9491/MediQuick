import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ShiftingCategoryNav = ({ categories = [] }) => {
  const [selected, setSelected] = useState(null);
  const [dir, setDir] = useState(null);

  const handleSetSelected = (val) => {
    if (typeof selected === 'number' && typeof val === 'number') {
      setDir(selected > val ? 'r' : 'l');
    } else if (val === null) {
      setDir(null);
    }
    setSelected(val);
  };

  return (
    <nav className="hidden border-b border-slate-100 bg-white sm:block px-4 sm:px-6 lg:px-8 relative z-40">
      <div 
        onMouseLeave={() => handleSetSelected(null)}
        className="mx-auto flex max-w-[1440px] items-center justify-center gap-4 relative"
      >
        {categories.map((cat, idx) => {
          const tabId = idx + 1;
          return (
            <Tab
              key={cat.name}
              tabId={tabId}
              selected={selected}
              handleSetSelected={handleSetSelected}
              path={cat.path}
            >
              {cat.name}
            </Tab>
          );
        })}

        <AnimatePresence>
          {selected && (
            <Content 
              categories={categories} 
              dir={dir} 
              selected={selected} 
            />
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

const Tab = ({ children, tabId, handleSetSelected, selected, path }) => {
  const isSelected = selected === tabId;
  return (
    <div
      id={`shift-tab-${tabId}`}
      onMouseEnter={() => handleSetSelected(tabId)}
      className="relative py-2.5"
    >
      <Link
        to={path || '#'}
        className={`flex items-center gap-1 text-[12.5px] font-bold transition-all px-3 py-1 rounded-full cursor-pointer ${
          isSelected 
            ? 'bg-[#0057FF]/10 text-[#0057FF]' 
            : 'text-slate-700 hover:text-[#0057FF]'
        }`}
      >
        <span>{children}</span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-250 ${
            isSelected ? 'rotate-180 text-[#0057FF]' : 'text-slate-400'
          }`}
        />
      </Link>
    </div>
  );
};

const Content = ({ selected, dir, categories }) => {
  return (
    <motion.div
      id="overlay-content"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full z-[100] mt-0 w-[520px] rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xl"
    >
      <Bridge />
      <Nub selected={selected} />

      {categories.map((cat, idx) => {
        const tabId = idx + 1;
        if (selected !== tabId) return null;

        const subOptions = cat.subOptions || [];

        return (
          <div className="overflow-hidden" key={cat.name}>
            <motion.div
              initial={{
                opacity: 0,
                x: dir === 'l' ? 70 : dir === 'r' ? -70 : 0,
              }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="grid grid-cols-12 gap-5"
            >
              {/* Subcategories Column */}
              <div className="col-span-7 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#0057FF]">
                    {cat.name}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400">
                    {subOptions.length} options
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                  {subOptions.map((sub, i) => {
                    const subName = typeof sub === 'object' ? sub.name : sub;
                    const subPath = typeof sub === 'object' 
                      ? sub.path 
                      : `/medicines?category=${encodeURIComponent(cat.name)}&subCategory=${encodeURIComponent(subName)}`;

                    return (
                      <Link
                        key={i}
                        to={subPath}
                        className="group flex items-center justify-between p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#0057FF]/5 hover:text-[#0057FF] transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-500 group-hover:bg-[#0057FF] group-hover:text-white flex items-center justify-center transition-colors">
                            <Sparkles size={12} />
                          </div>
                          <span className="truncate max-w-[180px]">{subName}</span>
                        </div>
                        <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#0057FF]" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Promo Card Column */}
              <div className="col-span-5 bg-gradient-to-br from-slate-900 via-[#0a1f3d] to-[#0057FF] rounded-xl p-4 text-white flex flex-col justify-between relative overflow-hidden shadow-xs">
                <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-white/10 blur-md pointer-events-none" />
                <div className="space-y-1.5 z-10">
                  <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-blue-200">
                    <ShieldCheck size={11} />
                    <span>MediQuick Verified</span>
                  </div>
                  <h4 className="text-xs font-black tracking-tight leading-tight">
                    Authentic {cat.name}
                  </h4>
                  <p className="text-[9.5px] text-slate-300 leading-snug line-clamp-2">
                    100% genuine certified healthcare items delivered to your doorstep.
                  </p>
                </div>

                <Link
                  to={cat.path || `/medicines?category=${encodeURIComponent(cat.name)}`}
                  className="mt-3 inline-flex items-center justify-center gap-1 bg-[#FF6B00] hover:bg-[#E55A00] text-white text-[9.5px] font-black uppercase tracking-wider py-1.5 px-3 rounded-lg shadow-xs active:scale-95 transition-all z-10"
                >
                  <span>Explore All</span>
                  <ArrowRight size={10} />
                </Link>
              </div>
            </motion.div>
          </div>
        );
      })}
    </motion.div>
  );
};

const Bridge = () => (
  <div className="absolute -top-[16px] left-0 right-0 h-[16px]" />
);

const Nub = ({ selected }) => {
  const [left, setLeft] = useState(0);

  useEffect(() => {
    moveNub();
  }, [selected]);

  const moveNub = () => {
    if (selected) {
      const hoveredTab = document.getElementById(`shift-tab-${selected}`);
      const overlayContent = document.getElementById('overlay-content');

      if (!hoveredTab || !overlayContent) return;

      const tabRect = hoveredTab.getBoundingClientRect();
      const { left: contentLeft } = overlayContent.getBoundingClientRect();

      const tabCenter = tabRect.left + tabRect.width / 2 - contentLeft;

      setLeft(tabCenter);
    }
  };

  return (
    <motion.span
      style={{
        clipPath: 'polygon(0 0, 100% 0, 50% 50%, 0% 100%)',
      }}
      animate={{ left }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className="absolute top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-tl border border-slate-200 bg-white"
    />
  );
};

export default ShiftingCategoryNav;
