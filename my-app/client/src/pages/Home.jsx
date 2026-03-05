import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import MedicineCard from '../components/medicine/MedicineCard';
import FeaturedBrands from '../components/common/FeaturedBrands';

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // State Management
  const [medicines, setMedicines] = useState([]);
  const [featured, setFeatured] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentBanner, setCurrentBanner] = useState(0);

  // 1. Unified Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Parallel fetching to improve load speed in Amritsar Hub
        const [allRes, topRes] = await Promise.all([
          fetch('http://localhost:5000/api/medicines'),
          fetch('http://localhost:5000/api/medicines/top')
        ]);

        const allData = await allRes.json();
        const topData = await topRes.json();

        // Strict array validation to prevent .map() crashes
        setMedicines(Array.isArray(allData) ? allData : []);
        setFeatured(Array.isArray(topData) ? topData : []);
      } catch (err) {
        console.error("Critical: API Connection Failed", err);
        setMedicines([]);
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Hero Banners Logic
  const banners = useMemo(() => [
    { title: "2-Hour Express Delivery", desc: "Fastest pharmacy delivery in Amritsar.", bg: "from-blue-700 to-blue-500", code: "QUICK20" },
    { title: "Flat 25% Off on Wellness", desc: "Vitamins and protein supplements at best prices.", bg: "from-green-700 to-green-500", code: "HEALTHY25" },
    { title: "Baby Care Bonanza", desc: "Top brands like Cetaphil & Himalaya available.", bg: "from-purple-700 to-purple-500", code: "BABYCARE" }
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const categories = ["All", "Pain Relief", "Antibiotics", "Vitamins", "Diabetes", "Baby Care", "Skin Care", "Wellness", "Snacks", "Energy Drinks"];

  // Filtering Optimization
  const filteredMedicines = useMemo(() => {
    return selectedCategory === "All" 
      ? medicines 
      : medicines.filter((med) => med.category === selectedCategory);
  }, [medicines, selectedCategory]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin text-4xl">💊</div>
      <p className="ml-3 font-black text-gray-400 uppercase tracking-widest">Loading Amritsar Hub...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
      <main className="flex-grow max-w-[1400px] mx-auto px-2 sm:px-4 py-4 w-full">
        
        {/* HERO BANNER SECTION */}
        <div className={`relative h-[200px] md:h-[320px] rounded-sm overflow-hidden text-white shadow-sm transition-all duration-1000 bg-gradient-to-r ${banners[currentBanner].bg}`}>
          <div className="absolute inset-0 flex flex-col justify-center px-10 z-10">
              <h1 className="text-3xl md:text-5xl font-black mb-2 animate-slideIn">{banners[currentBanner].title}</h1>
              <p className="text-lg opacity-90">{banners[currentBanner].desc}</p>
              <div className="mt-6 flex items-center gap-4">
                <button className="bg-white text-blue-600 px-8 py-2.5 font-black rounded-sm shadow-md uppercase text-xs hover:bg-gray-100">Shop Now</button>
                <span className="text-[10px] font-black border-2 border-dashed border-white/50 px-3 py-1.5 rounded uppercase tracking-widest">Code: {banners[currentBanner].code}</span>
              </div>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${currentBanner === i ? "w-8 bg-white" : "w-2 bg-white/40"}`} />
            ))}
          </div>
        </div>

        {/* TRUSTED BRANDS */}
        <div className="bg-white mt-4 p-4 shadow-sm border border-gray-200">
           <FeaturedBrands />
        </div>

        {/* DEALS OF THE DAY */}
<div className="bg-white mt-4 shadow-sm border border-gray-200 overflow-hidden">
  <div className="flex justify-between items-center p-4 border-b border-gray-100">
    <div className="flex items-center gap-3">
      <h2 className="text-xl font-black text-gray-800 italic uppercase">Deals of the Day</h2>
      <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-black animate-pulse">LIVE</span>
    </div>
    <button className="text-blue-600 font-black text-xs uppercase hover:underline">View All</button>
  </div>
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 divide-x divide-gray-100">
    {featured.length > 0 ? featured.map(med => (
      /* FIX: Use the spread operator {...med} just like you did in the main list.
         This ensures all props (name, price, image, etc.) reach the card correctly.
      */
      <MedicineCard key={med._id} {...med} />
    )) : (
      <div className="col-span-full py-10 text-center text-gray-400 font-bold uppercase text-xs italic">
        Deals loading from Amritsar database...
      </div>
    )}
  </div>
</div>

        {/* SIDEBAR FILTERS & PRODUCT GRID */}
        <div className="mt-6 flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-64 bg-white p-5 shadow-sm border border-gray-200 h-fit lg:sticky lg:top-20">
            <h3 className="font-black text-gray-900 mb-6 uppercase text-[10px] tracking-[2px] border-b pb-3">Department</h3>
            <div className="space-y-3">
               {categories.map(cat => (
                 <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                   <input 
                    type="radio" name="category" checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                    className="w-4 h-4 accent-blue-600"
                   />
                   <span className={`text-xs uppercase font-black tracking-tighter transition-colors ${selectedCategory === cat ? "text-blue-600" : "text-gray-500 group-hover:text-blue-400"}`}>{cat}</span>
                 </label>
               ))}
            </div>
          </div>

          <div className="flex-1">
             <div className="bg-white p-4 border border-gray-200 mb-4 flex justify-between items-center shadow-sm">
                <h2 className="font-black text-lg text-gray-800 uppercase italic tracking-tighter">{selectedCategory} Collection</h2>
                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{filteredMedicines.length} In Stock</span>
             </div>

             {filteredMedicines.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 {filteredMedicines.map(med => (
                   <MedicineCard key={med._id} {...med} />
                 ))}
               </div>
             ) : (
               <div className="bg-white p-20 text-center border border-gray-200 rounded-sm shadow-inner">
                 <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No products found in this category.</p>
                 <button onClick={() => setSelectedCategory("All")} className="mt-4 text-blue-600 font-black text-xs uppercase hover:underline">Reset Filters</button>
               </div>
             )}
          </div>
        </div>
      </main>

      {/* GLOBAL FOOTER */}
      <footer className="bg-white border-t mt-20 py-12">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-4">
            <h4 className="font-black text-blue-600 uppercase italic text-2xl tracking-tighter">MediQuick+</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed tracking-wide">
              Verified medicines delivered in 120 minutes across Amritsar. Dedicated to your health and convenience.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-black text-gray-900 uppercase border-b border-gray-100 pb-2 mb-2 tracking-widest">Service Desk</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase cursor-pointer hover:text-blue-600 transition-colors">Track Delivery</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase cursor-pointer hover:text-blue-600 transition-colors">Return Policy</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase cursor-pointer hover:text-blue-600 transition-colors">Privacy Center</span>
          </div>
          <div className="space-y-2">
             <span className="text-[11px] font-black text-gray-900 uppercase border-b border-gray-100 pb-2 mb-4 block tracking-widest">Hub Location</span>
             <p className="text-[10px] text-gray-400 font-bold uppercase">Ranjit Avenue, Amritsar, Punjab</p>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Direct Hub: +91 98765-43210</p>
             <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">support@amritsarhub.com</p>
          </div>
        </div>
        <div className="border-t border-gray-50 mt-12 pt-8">
          <p className="text-[9px] text-gray-300 font-black text-center uppercase tracking-[5px]">
            © 2026 MediQuick Amritsar Hub • Licensed Pharmacy
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn { animation: slideIn 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Home;