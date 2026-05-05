import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, ShieldCheck, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const MedicineCard = ({ _id, name, brand, price, image, discountPrice, isFlashDeal, category }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const finalPrice = discountPrice || price;
  const mrp = isFlashDeal ? price : Math.round(price * 1.33);
  const discountPercent = Math.round(((mrp - finalPrice) / mrp) * 100);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart({ _id, name, brand, price: finalPrice, image });
    toast.success('Added to bag');
  };

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => navigate(`/product/${_id}`)}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-slate-100 bg-white p-3 transition-all duration-500 hover:border-[#00a2a4] hover:shadow-[0_25px_50px_-12px_rgba(0,162,164,0.25)]"
    >
      {/* Discount Tag */}
      {discountPercent > 0 && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-sm bg-[#ff6f61] px-1.5 py-0.5 text-[9px] font-extrabold text-white">
          <span>{discountPercent}% OFF</span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative mb-3 flex aspect-square w-full items-center justify-center bg-white p-2">
        <img
          src={image || 'https://placehold.co/300x300?text=Medicine'}
          alt={name}
          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Quick Add Overlay (Mobile Friendly) */}
        <button 
          onClick={handleAdd}
          className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-900 shadow-lg border border-slate-100 hover:bg-slate-900 hover:text-white transition-all active:scale-90 sm:hidden"
        >
          <Plus size={16} strokeWidth={3} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        <div className="mb-1 flex items-center gap-1">
          <ShieldCheck className="h-3 w-3 text-blue-500" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Verified Hub</span>
        </div>
        
        <h3 className="mb-1 line-clamp-2 min-h-[36px] text-xs font-bold leading-tight text-slate-900 group-hover:text-[#00a2a4]">
          {name}
        </h3>
        
        <p className="mb-2 text-[10px] font-medium text-slate-400 truncate">
          {brand}
        </p>

        <div className="mt-auto">
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <span className="line-through">MRP ₹{mrp}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-slate-900">₹{finalPrice}</span>
            </div>
            
            <button
              onClick={handleAdd}
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50/50 px-3 py-1.5 text-[10px] font-bold text-blue-600 transition-all hover:bg-blue-600 hover:text-white"
            >
              ADD <Plus size={12} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MedicineCard;