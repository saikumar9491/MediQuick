import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MedicineCard from '../components/medicine/MedicineCard';
import { ChevronRight, Filter, Star, Info, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE } from '../utils/apiConfig';

const BrandPage = () => {
  const { brandName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [brandBanner, setBrandBanner] = useState(null);
  const scrollRef = useRef(null);

  const CATEGORY_METADATA = {
    'Skin care': { image: 'https://onemg.gumlet.io/diagnostics%2F2023-11%2F1699443647_skinn.webp?format=auto', bgColor: '#f1f4f6' },
    'Hair Care': { image: 'https://onemg.gumlet.io/diagnostics%2F2023-11%2F1699443670_hairr.webp?format=auto', bgColor: '#f1f4f6' },
    'Sexual Wellness': { image: 'https://onemg.gumlet.io/diagnostics%2F2023-11%2F1699443681_sexuall.webp?format=auto', bgColor: '#f1f4f6' },
    'Oral Care': { image: 'https://onemg.gumlet.io/diagnostics%2F2023-11%2F1699443695_orall.webp?format=auto', bgColor: '#f1f4f6' },
    'Elderly Care': { image: 'https://onemg.gumlet.io/diagnostics%2F2023-11%2F1699443705_elderly.webp?format=auto', bgColor: '#f1f4f6' },
    'Baby Care': { image: 'https://onemg.gumlet.io/diagnostics%2F2023-11%2F1699443714_baby.webp?format=auto', bgColor: '#f1f4f6' },
    'Women Care': { image: 'https://onemg.gumlet.io/diagnostics%2F2023-11%2F1699443722_womenn.webp?format=auto', bgColor: '#f1f4f6' },
    'Men Grooming': { image: 'https://onemg.gumlet.io/diagnostics%2F2023-11%2F1699443735_menn.webp?format=auto', bgColor: '#f1f4f6' },
    'Ayurveda': { image: 'https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/v1642501662/m79998p7v66n6s9z6s9z.png', bgColor: '#fff4f4' },
    'Vitamins': { image: 'https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/v1642501662/m79998p7v66n6s9z6s9z.png', bgColor: '#f1f4f6' },
    'All': { image: 'https://www.1mg.com/favicon.ico', bgColor: '#f1f4f6' }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products specifically for this brand
        const prodRes = await fetch(`${API_BASE}/api/medicines?brand=${encodeURIComponent(brandName)}`);
        const prodData = await prodRes.json();
        
        if (Array.isArray(prodData)) {
          setProducts(prodData);
        } else {
          setProducts([]);
        }

        // Fetch brand banner
        const bannerRes = await fetch(`${API_BASE}/api/banners`);
        const bannerData = await bannerRes.json();
        const matchedBanner = bannerData.find(
          b => b.category === 'brand' && b.brand?.toLowerCase() === brandName?.toLowerCase() && b.isActive
        );
        setBrandBanner(matchedBanner);

      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [brandName]);

  // Group products by category
  const categoriesList = [...new Set(products.map(p => p.category))];
  const categories = ['All', ...categoriesList];

  // Map each category to its first product image for the sidebar
  const categoryImages = products.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = p.image;
    return acc;
  }, { 'All': products[0]?.image });

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const groupedByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white pt-24">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#ff6f61]/20 border-t-[#ff6f61]"></div>
          <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Loading {brandName} Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16 sm:pt-20">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row">
        
        {/* Left Sidebar - Desktop */}
        <aside className="hidden lg:block w-[120px] bg-[#f6f6f6] sticky top-20 h-[calc(100vh-80px)] border-r border-slate-100 overflow-y-auto no-scrollbar">
          <div className="flex flex-col">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative w-full min-h-[100px] flex flex-col items-center justify-center p-2 transition-all group ${
                  activeCategory === cat 
                  ? 'bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]' 
                  : 'hover:bg-slate-100'
                }`}
              >
                {/* Category Image */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-1.5 transition-all overflow-hidden p-1 ${
                  activeCategory === cat ? 'bg-white' : 'bg-white'
                }`}>
                  <img 
                    src={categoryImages[cat]} 
                    alt={cat} 
                    className={`w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 ${
                      activeCategory === cat ? 'opacity-100' : 'opacity-80'
                    }`} 
                  />
                </div>
                <span className={`text-[9px] font-black text-center leading-tight px-1 uppercase tracking-tighter ${
                  activeCategory === cat ? 'text-[#ff6f61]' : 'text-slate-500'
                }`}>
                  {cat}
                </span>

                {/* Active Indicator Bar on the Right */}
                {activeCategory === cat && (
                  <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#ff6f61]" />
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white p-4 sm:p-6">
          
          {/* Brand Header / Banner */}
          <section className="mb-6">
            <div className="relative overflow-hidden rounded-lg bg-white border border-slate-100">
              {brandBanner ? (
                <div className={`w-full aspect-[4/1] flex items-center justify-center relative ${brandBanner.bg}`}>
                  <img 
                    src={brandBanner.image} 
                    alt={brandBanner.title} 
                    className="absolute right-0 h-full w-1/2 object-cover rounded-l-[100px] border-l-4 border-white/20 shadow-[-10px_0_20px_rgba(0,0,0,0.1)]" 
                  />
                  <div className="absolute inset-0 flex flex-col justify-center px-12 text-white z-10">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2 drop-shadow-md">
                      {brandBanner.title}
                    </h2>
                    {brandBanner.desc && (
                      <p className="text-sm font-black uppercase tracking-widest opacity-90 drop-shadow-md">
                        {brandBanner.desc}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                /* Fallback Banner */
                <div className="w-full aspect-[4/1] bg-slate-900 flex items-center justify-center relative">
                  <img 
                    src="https://media.licdn.com/dms/image/v2/C4E12AQH8_mZf-8_0WA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1624864402633?e=2147483647&v=beta&t=9xVf3WjWvFfG_uUuG_o_g_u_g_u_g_u_g_u_g_u_g_u" 
                    alt="Default Banner" 
                    className="w-full h-full object-cover opacity-80" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-12 text-white">
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">{brandName} Collection</h2>
                    <p className="text-sm font-bold opacity-90">Explore the full range of<br/><span className="text-2xl font-black">Pharmaceutical Solutions</span></p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Mobile Categories Scroll */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sticky top-16 bg-white z-20 pt-2 border-b border-slate-50">
             {categories.map(cat => (
               <button
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={`whitespace-nowrap px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                   activeCategory === cat 
                   ? 'bg-[#ff6f61] text-white' 
                   : 'bg-slate-50 text-slate-500'
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>

          {/* Products Sections */}
          {activeCategory === 'All' ? (
            Object.keys(groupedByCategory).map((category) => (
              <section key={category} className="mb-10">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h2 className="text-lg font-bold text-slate-900">{category}</h2>
                  <button className="flex items-center gap-1 text-[11px] font-bold text-[#ff6f61] hover:underline uppercase tracking-widest">
                    see all <ChevronRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                  {groupedByCategory[category].map((p) => (
                    <MedicineCard key={p._id} {...p} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <section className="mb-10">
               <div className="flex items-center justify-between mb-4 px-2">
                  <h2 className="text-lg font-bold text-slate-900">{activeCategory}</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                  {filteredProducts.map((p) => (
                    <MedicineCard key={p._id} {...p} />
                  ))}
                </div>
            </section>
          )}
          
          {products.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-slate-100 mt-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                <ShoppingBag size={32} />
              </div>
              <h3 className="mt-6 text-sm font-black uppercase tracking-widest text-slate-900">No products for {brandName}</h3>
              <p className="mt-1 text-[10px] font-bold text-slate-400">We haven't added any products for this brand to the Hub yet.</p>
              <button 
                onClick={() => navigate('/medicines')}
                className="mt-8 rounded-lg bg-[#ff6f61] px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg active:scale-95 transition-all"
              >
                BROWSE ALL MEDICINES
              </button>
            </div>
          )}

        </main>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default BrandPage;