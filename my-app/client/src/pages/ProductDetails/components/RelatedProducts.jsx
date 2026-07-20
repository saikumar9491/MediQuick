import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export const RelatedProducts = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">You May Also Like</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.slice(0, 4).map(prod => {
          const price = prod.discountPrice || prod.price;
          const mrp = Math.round(prod.price * 1.33);
          const hasDiscount = !!prod.discountPrice;
          
          return (
            <Link 
              key={prod._id} 
              to={`/product/${prod._id}`}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div className="aspect-square w-full rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center p-4 mb-3">
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-250"
                />
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">
                  {prod.category}
                </span>
                <h3 className="text-xs font-black text-slate-800 tracking-tight line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {prod.name}
                </h3>
                <p className="text-[10px] font-bold text-slate-450 italic leading-none">{prod.brand}</p>
                
                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-xs font-bold text-slate-900">₹{price}</span>
                  {hasDiscount && (
                    <span className="text-[10px] line-through text-slate-400">₹{mrp}</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
