import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BrandPage = () => {
  const { brandName } = useParams();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/medicines');
        const data = await res.json();
        // Filter medicines where brand matches URL parameter
        const filtered = data.filter(m => m.brand.toLowerCase() === brandName.toLowerCase());
        setMedicines(filtered);
      } catch (err) {
        console.error("Hub Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
    window.scrollTo(0, 0);
  }, [brandName]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white pt-20">
      <div className="animate-bounce text-[#a855f7] text-4xl font-black italic">M+</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 pt-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* BRAND HEADER */}
        <div className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm mb-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
             <h1 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
               {brandName} <span className="text-[#a855f7]">Solutions</span>
             </h1>
             <p className="text-[10px] text-gray-400 font-black uppercase tracking-[5px] mt-4 italic">
               Direct Hub Authorization • {medicines.length} Verified Products
             </p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="bg-gray-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#a855f7] transition-all shadow-xl shadow-purple-100"
          >
            ← All Categories
          </button>
        </div>

        {/* PRODUCTS GRID */}
        {medicines.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[40px] border border-dashed">
            <p className="text-gray-400 font-black uppercase italic tracking-widest">Currently restocking {brandName} Hub inventory...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {medicines.map((item) => (
              <div 
                key={item._id}
                onClick={() => navigate(`/product/${item._id}`)}
                className="bg-white border border-gray-100 rounded-[35px] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group"
              >
                <div className="h-40 w-full mb-6 flex items-center justify-center bg-[#fafafa] rounded-[25px] relative overflow-hidden">
                  <img src={item.image} alt={item.name} className="h-28 w-28 object-contain group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black text-[#a855f7] border border-purple-100 uppercase italic">
                    Hub Verified
                  </div>
                </div>
                <h3 className="text-sm font-black text-gray-900 uppercase italic tracking-tighter leading-tight h-10 line-clamp-2">{item.name}</h3>
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-2xl font-black text-[#a855f7] italic tracking-tighter">₹{item.price}</p>
                  <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center group-hover:bg-[#a855f7] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandPage;