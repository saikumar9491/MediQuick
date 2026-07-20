import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchRecommendations, addItem } from '../../../api/cart';
import { useAuth } from '../../../context/AuthContext';

const RecommendedProducts = ({ cartCategories = [] }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const results = await fetchRecommendations(cartCategories, 10);
        setProducts(Array.isArray(results) ? results.slice(0, 10) : []);
      } catch (_) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [cartCategories.join(',')]);

  const handleAdd = async (product) => {
    if (!token) { navigate('/login'); return; }
    setAddingId(product._id);
    try {
      await addItem(token, product._id, 1);
      toast.success(`${product.name.split(' ').slice(0, 3).join(' ')} added to cart`);
    } catch (e) {
      toast.error(e.message || 'Could not add item');
    } finally {
      setAddingId(null);
    }
  };

  if (!loading && products.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">You May Also Like</h3>

      {loading ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-36 h-52 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
        >
          {products.map(product => {
            const salePrice = product.discountPrice && product.discountPrice < product.price
              ? product.discountPrice : product.price;
            const hasDiscount = salePrice < product.price;
            const isOos = product.countInStock === 0;
            const isAdding = addingId === product._id;

            return (
              <div
                key={product._id}
                className="flex-shrink-0 w-36 rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-slate-300 hover:shadow-sm transition-all"
              >
                {/* Image */}
                <button
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="w-full h-28 flex items-center justify-center bg-slate-50 p-2"
                >
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <div className="w-10 h-10 bg-slate-200 rounded-lg" />
                  )}
                </button>

                <div className="p-3 space-y-2">
                  <p className="text-[11px] font-medium text-slate-800 leading-tight line-clamp-2">{product.name}</p>
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-xs font-semibold text-slate-900">₹{salePrice}</span>
                    {hasDiscount && (
                      <span className="text-[10px] text-slate-400 line-through">₹{product.price}</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAdd(product)}
                    disabled={isOos || isAdding}
                    className={`w-full py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1 ${
                      isOos
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
                    }`}
                  >
                    {isAdding ? (
                      <span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    ) : isOos ? (
                      'Out of Stock'
                    ) : (
                      <><Plus size={11} /> Add</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecommendedProducts;
