import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Plus } from 'lucide-react';
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
      className="group relative flex w-full h-full flex-col bg-white transition-all duration-300"
    >
      {/* Bestseller Tag */}
      {rating >= 4.5 && (
        <div className="absolute top-0 left-0 z-10 bg-[#ffecd1] px-2 py-0.5 text-[10px] font-bold text-[#ca8a04] flex items-center gap-0.5">
          Bestseller <span className="text-[12px]">+</span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative mb-4 flex aspect-square w-full items-center justify-center bg-white p-4">
        <img
          src={image || 'https://placehold.co/300x300?text=Medicine'}
          alt={name}
          className="h-full w-full object-contain mix-blend-multiply"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-1">
        <p className="mb-0.5 text-[10px] font-black uppercase tracking-widest text-[#00a2a4]">
          {brand}
        </p>
        <h3 className="mb-1 line-clamp-2 min-h-[34px] text-[13px] font-medium leading-tight text-slate-900 group-hover:text-[#ff6f61]">
          {name}
        </h3>
        
        <p className="mb-2 text-[11px] text-slate-500">
          10 capsules
        </p>

        {/* Rating Section */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className={i < 4 ? "fill-teal-500 text-teal-500" : "text-slate-200"} />
            ))}
          </div>
          <span className="text-[11px] text-teal-600 font-bold">{rating}</span>
          <span className="text-[11px] text-slate-400 font-medium">({numReviews})</span>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14px] font-bold text-slate-900">₹{finalPrice}</span>
            <span className="text-[12px] text-slate-400 line-through">₹{mrp}</span>
            <span className="text-[12px] font-bold text-teal-600">{discountPercent}% off</span>
          </div>
          
          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center rounded border border-[#ff6f61] bg-white py-1.5 text-[12px] font-bold text-[#ff6f61] transition-all hover:bg-[#ff6f61] hover:text-white"
          >
            ADD
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MedicineCard;