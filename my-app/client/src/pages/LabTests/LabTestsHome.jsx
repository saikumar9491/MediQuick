import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ShieldCheck, 
  Truck, 
  Clock, 
  ChevronRight, 
  Flame, 
  Stethoscope, 
  Activity, 
  Sparkles, 
  Heart,
  Droplet,
  SlidersHorizontal,
  LayoutGrid,
  Info
} from 'lucide-react';
import { getLabTests } from '../../api/labTests';
import { getPageContent } from '../../api/pageContent';
import ComingSoonHero from '../../components/common/ComingSoonHero';

const LabTestsHome = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');

  const categories = [
    { name: 'All', icon: LayoutGrid, color: 'bg-slate-100 text-slate-600' },
    { name: 'Full Body Checkup', icon: Sparkles, color: 'bg-blue-50 text-[#00a2a4]' },
    { name: 'Thyroid', icon: Droplet, color: 'bg-amber-50 text-amber-600' },
    { name: 'Diabetes', icon: Activity, color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Heart Health', icon: Heart, color: 'bg-red-50 text-red-600' },
    { name: 'Liver Care', icon: Flame, color: 'bg-orange-50 text-orange-600' },
    { name: 'Kidney Function', icon: Stethoscope, color: 'bg-indigo-50 text-indigo-600' }
  ];

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const data = await getLabTests();
        setTests(data);
      } catch (err) {
        console.error('Failed to load lab tests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const filteredTests = useMemo(() => {
    let result = tests;

    if (selectedCategory !== 'All') {
      result = result.filter(t => t.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim());
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.name.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q) || 
        t.parameters.some(p => p.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
    }

    return result;
  }, [tests, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAFBFD] pb-24 pt-4 sm:pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Hero banner */}
        <section className="mb-8 overflow-hidden rounded-[24px] shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-slate-100 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(0,162,164,0.08)_0%,transparent_100%),linear-gradient(135deg,#0a1525_0%,#032d2e_100%)]" />
          
          <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <span className="mb-2 inline-block text-[9px] font-black uppercase tracking-[0.2em] text-[#00d4d6]">
                DIAGNOSTIC SERVICE
              </span>
              <h1 className="text-2xl sm:text-4xl font-normal tracking-tight text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
                Book lab tests <br />from your home.
              </h1>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-300 max-w-md">
                Certified lab assistants collect samples at your convenience. Accurate diagnostic reports are uploaded directly to your profile.
              </p>
            </div>

            {/* Interactive Search Bar in Hero */}
            <div className="w-full md:w-96 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="text"
                  placeholder="Search tests (e.g. Thyroid, CBC)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200/50 pl-10 pr-4 py-2.5 rounded-full text-xs outline-none focus:border-[#00a2a4] transition-all text-slate-800"
                />
              </div>
              <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-300 font-semibold px-1">
                <ShieldCheck size={12} className="text-[#00d4d6]" />
                <span>NABL Accredited Lab Partners Only</span>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Medical Trust Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { title: 'Home Sample Collection', desc: 'Vaccinated and trained medical collectors visit your site', icon: Truck },
            { title: 'Secure Report Delivery', desc: 'PDF analysis uploaded to account in 24-48 hours', icon: Clock },
            { title: 'Accredited Lab Processing', desc: 'Partnering exclusively with certified local diagnostic centers', icon: ShieldCheck }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex gap-4 p-5 bg-white border border-slate-200/50 rounded-2xl shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#00a2a4] shrink-0 border border-slate-100">
                  <Icon size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Browse by Health Concern Tiles */}
        <section className="mb-16">
          <h3 className="text-[10px] font-bold tracking-[0.16em] text-slate-400 uppercase mb-6">Browse by Health Concern</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl text-center border transition-all cursor-pointer ${
                    isActive 
                      ? 'border-[#00a2a4] bg-white shadow-md shadow-[#00a2a4]/4' 
                      : 'border-slate-200/50 bg-white hover:border-slate-400 hover:shadow-xs'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${isActive ? 'bg-[#00a2a4]/10 text-[#00a2a4]' : cat.color}`}>
                    <Icon size={15} strokeWidth={2.5} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-tight">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex flex-row gap-8">
          {/* Main Grid List */}
          <main className="flex-1">
            {/* Header controls */}
            <div className="flex items-end justify-between border-b border-slate-100 pb-5 mb-8">
              <div>
                <h2 className="text-xl font-medium text-slate-900 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                  {selectedCategory} Packages
                </h2>
                <p className="mt-1 text-[11px] text-slate-400 font-semibold">
                  Showing {filteredTests.length} diagnostic profiles
                </p>
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                <SlidersHorizontal size={12} />
                <span>Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none text-slate-800 outline-none cursor-pointer pr-1 font-bold hover:text-[#00a2a4] transition-colors"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Test Cards Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="aspect-[4/3] animate-pulse rounded-[18px] bg-slate-50 border border-slate-100" />
                ))}
              </div>
            ) : filteredTests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTests.map((test) => {
                  const hasDiscount = !!test.discountedPrice && test.discountedPrice < test.price;
                  const finalPrice = hasDiscount ? test.discountedPrice : test.price;
                  const discountPercent = hasDiscount ? Math.round(((test.price - test.discountedPrice) / test.price) * 100) : 0;
                  
                  return (
                    <motion.div
                      key={test._id}
                      layout
                      className="group relative flex flex-col justify-between bg-white border border-slate-200/50 rounded-[18px] p-5 shadow-xs transition-all duration-300 hover:border-[#00a2a4] hover:shadow-[0_12px_40px_rgba(0,162,164,0.05)] cursor-pointer"
                      onClick={() => navigate(`/lab-tests/${test._id}`)}
                    >
                      <div>
                        {/* Tags */}
                        <div className="flex items-center justify-between mb-3.5">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#00a2a4] bg-[#00a2a4]/5 px-2.5 py-0.5 rounded-full">
                            {test.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                            <Clock size={11} /> {test.turnaroundHours}h
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-bold text-slate-800 group-hover:text-[#00a2a4] transition-colors leading-snug tracking-tight mb-2">
                          {test.name}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-4">
                          {test.description}
                        </p>

                        {/* Parameters count */}
                        {test.parameters && test.parameters.length > 0 && (
                          <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg text-[10px] font-semibold text-slate-500 mb-4 border border-slate-100">
                            <Info size={11} className="text-slate-400 shrink-0" />
                            <span>Includes {test.parameters.length} key biomarker parameters</span>
                          </div>
                        )}
                      </div>

                      {/* Pricing and Button */}
                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-bold text-slate-855">₹{finalPrice}</span>
                            {hasDiscount && (
                              <span className="text-[10px] text-slate-400 line-through">₹{test.price}</span>
                            )}
                          </div>
                          {hasDiscount && (
                            <span className="text-[9px] font-black uppercase text-[#00a2a4] tracking-wider mt-0.5">
                              {discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/lab-tests/${test._id}/book`);
                          }}
                          className="flex items-center justify-center gap-1 py-1.5 px-4 rounded-full border border-slate-200 bg-transparent text-xs font-bold text-slate-750 hover:border-slate-800 hover:text-slate-900 transition-all cursor-pointer active:scale-98"
                        >
                          Book Now
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-slate-200/50 shadow-xs">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300 mb-6">
                  <Stethoscope size={28} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">No tests found</h3>
                <p className="mt-1.5 text-xs text-slate-400 max-w-[220px]">Try adjusting your search criteria or category concerns filter.</p>
                <button 
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                  className="mt-6 rounded-full border border-slate-200 px-6 py-2.5 text-xs font-bold text-slate-700 hover:border-slate-800 transition-all cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default LabTestsHome;
