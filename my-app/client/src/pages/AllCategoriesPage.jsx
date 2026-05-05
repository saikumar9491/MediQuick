import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MedicineCard from '../components/medicine/MedicineCard';
import { API_BASE } from '../utils/apiConfig';

const AllCategoriesPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/medicines`);
        const data = await res.json();
        setMedicines(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  const groupedMedicines = medicines.reduce((acc, med) => {
    if (!acc[med.category]) acc[med.category] = [];
    acc[med.category].push(med);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-slate-800">
            Store Directory <span className="text-[#00a2a4]">Catalog</span>
          </h1>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">
            Explore our complete inventory grouped by health department
          </p>
        </div>

        {loading ? (
          <div className="space-y-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-8 w-48 bg-slate-200 rounded mb-6" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(j => <div key={j} className="h-64 bg-white rounded-xl border border-slate-100" />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-16">
            {Object.keys(groupedMedicines).map(catName => (
              <section key={catName} className="animate-fadeIn">
                <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-teal-50 text-[#00a2a4]">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-black uppercase tracking-[2px] text-slate-800">
                        {catName}
                      </h2>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {groupedMedicines[catName].length} VERIFIED PRODUCTS
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/medicines?filter=${catName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`)}
                    className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-200 hover:border-[#00a2a4] hover:text-[#00a2a4] transition-all shadow-sm"
                  >
                    Enter Hub
                    <ChevronRight size={14} />
                  </button>
                </div>
                
                <div className="custom-scrollbar flex gap-4 overflow-x-auto pb-6 scroll-smooth snap-x">
                  {groupedMedicines[catName].map((item) => (
                    <div key={item._id} className="min-w-[160px] max-w-[160px] sm:min-w-[200px] sm:max-w-[200px] snap-start">
                      <MedicineCard {...item} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {!loading && medicines.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 h-20 w-20 flex items-center justify-center rounded-full bg-slate-50 text-slate-300">
               <ShoppingBag size={40} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-widest text-slate-800">Hub Inventory Empty</h3>
            <p className="mt-2 text-sm font-bold text-slate-400">Our stock update is currently in progress. Please check back shortly.</p>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #00a2a4;
        }
      `}</style>
    </div>
  );
};

export default AllCategoriesPage;
