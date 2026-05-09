import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Plus, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const MedicineCard = ({ _id, name, brand, price, image, discountPrice, isFlashDeal, category, rating = 4.3, numReviews = 1240 }) => {
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
      onClick={() => navigate(`/product/${_id}`)}
      className="group relative flex w-full h-full flex-col bg-white transition-all duration-300 hover:shadow-xl border border-slate-100 rounded-xl overflow-hidden"
    >
      {/* Wishlist Icon */}
      <button className="absolute top-3 right-3 z-20 text-slate-200 hover:text-red-500 transition-colors bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all">
        <Heart size={16} />
      </button>

      {/* Image Container - Reduced Height & Padding */}
      <div className="relative flex h-[160px] sm:h-[180px] w-full items-center justify-center bg-white p-2 sm:p-4">
        <img
          src={image || 'https://placehold.co/300x300?text=Medicine'}
          alt={name}
          className="h-full w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Flash Deal Tag */}
        {isFlashDeal && (
          <div className="absolute bottom-2 left-2 bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg shadow-red-200">
            Flash Deal
          </div>
        )}
      </div>

      {/* Content - Compact Layout */}
      <div className="flex flex-1 flex-col px-3 pb-3 pt-1">
        <p className="mb-0.5 text-[9px] font-black uppercase tracking-widest text-slate-400">
          {brand}
        </p>
        <h3 className="mb-1 line-clamp-2 min-h-[30px] text-[12px] font-bold leading-tight text-slate-800 group-hover:text-[#00a2a4] transition-colors">
          {name}
        </h3>
        
        {/* Rating Pill - Flipkart Style */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-0.5 bg-green-600 text-white px-1.5 py-0.5 rounded text-[10px] font-black">
            {rating} <Star size={8} fill="white" stroke="white" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold">({numReviews})</span>
        </div>

        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[15px] font-black text-slate-900 leading-none">₹{finalPrice}</span>
            <span className="text-[11px] text-slate-400 line-through leading-none mt-0.5">₹{mrp}</span>
            <span className="text-[11px] font-black text-green-600 leading-none mt-0.5">{discountPercent}% off</span>
          </div>
          
          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center rounded-lg border-2 border-[#ff6f61]/10 bg-[#ff6f61]/5 py-2 text-[10px] font-black uppercase tracking-widest text-[#ff6f61] transition-all hover:bg-[#ff6f61] hover:text-white hover:border-[#ff6f61] shadow-sm active:scale-95"
          >
            Add to Bag
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MedicineCard;