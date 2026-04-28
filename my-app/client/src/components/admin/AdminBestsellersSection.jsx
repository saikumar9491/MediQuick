import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, ShieldCheck, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminBestsellersSection = ({ inventory, setInventory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Calculate bestsellers. If isBestseller doesn't exist, we fallback to random or manual selection.
  const bestsellers = inventory.filter(m => m.isBestseller || m.rating >= 4.5);
  const nonBestsellers = inventory.filter(m => !m.isBestseller && m.rating < 4.5 && m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const toggleBestseller = (medId, currentStatus) => {
    // Optimistic UI update
    setInventory(inventory.map(m => m._id === medId ? { ...m, isBestseller: !currentStatus } : m));
    toast.success(!currentStatus ? 'Promoted to Bestseller! 🏆' : 'Removed from Bestsellers');
  };

  return (
    <div className="p-6 bg-white/50 backdrop-blur-md rounded-3xl border border-gray-100 shadow-xl animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase flex items-center gap-2">
            <Trophy className="text-amber-500 h-8 w-8" /> Bestsellers in Amritsar Hub
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
            Top velocity products driving massive volume
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Leaderboard Column */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">🏆 Live Leaderboard</h3>
          {bestsellers.length > 0 ? (
            bestsellers.map((med, index) => (
              <motion.div
                key={med._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl font-black italic text-lg text-amber-600 bg-amber-50 group-hover:scale-110 transition-transform">
                    #{index + 1}
                  </div>
                  <img src={med.image} alt={med.name} className="h-12 w-12 rounded-xl object-contain bg-white border border-gray-100 p-1" />
                  <div>
                    <h4 className="text-sm font-black uppercase italic text-slate-900">{med.name}</h4>
                    <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">{med.brand}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs font-black text-amber-600">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {med.rating || '4.8'}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Rating</span>
                  </div>
                  <button 
                    onClick={() => toggleBestseller(med._id, true)}
                    className="rounded-xl bg-red-50 hover:bg-red-500 hover:text-white text-red-500 p-2 transition-all duration-300"
                    title="Remove from Bestsellers"
                  >
                    Demote
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl">
              <Star className="mx-auto h-12 w-12 text-gray-200" />
              <p className="text-xs font-bold text-gray-400 mt-2">No bestsellers marked yet.</p>
            </div>
          )}
        </div>

        {/* Promotion Column */}
        <div className="bg-slate-50/50 rounded-2xl p-6 border border-gray-100 flex flex-col h-fit">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
             Promote Units
          </h3>
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mb-4 p-3 rounded-xl border border-gray-200 text-xs font-bold focus:border-amber-500 outline-none transition"
          />

          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {nonBestsellers.map(med => (
              <div 
                key={med._id}
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 hover:border-amber-400 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img src={med.image} alt="" className="h-8 w-8 rounded-lg object-contain bg-slate-50" />
                  <span className="text-xs font-bold text-slate-900 line-clamp-1 max-w-[120px]">{med.name}</span>
                </div>
                <button
                  onClick={() => toggleBestseller(med._id, false)}
                  className="rounded-lg bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-600 px-3 py-1.5 text-[10px] font-black uppercase transition-all"
                >
                  Promote
                </button>
              </div>
            ))}
            {nonBestsellers.length === 0 && (
              <p className="text-[10px] text-center text-gray-400 font-bold py-4">No matching units</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminBestsellersSection;
