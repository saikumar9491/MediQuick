import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Heart, Share2, Truck, RotateCcw, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { API_BASE } from '../../utils/apiConfig';
import toast from 'react-hot-toast';

// Subcomponents imports
import { ImageGallery } from './components/ImageGallery';
import { ProductInfoPanel } from './components/ProductInfoPanel';
import { DeliveryEstimateBlock } from './components/DeliveryEstimateBlock';
import { ProductTabs } from './components/ProductTabs';
import { ReviewsSection } from './components/ReviewsSection';
import { RelatedProducts } from './components/RelatedProducts';
import { StickyMobileCartBar } from './components/StickyMobileCartBar';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, setUser, loading: authLoading } = useAuth();
  const { addToCart } = useCart();

  const [medicine, setMedicine] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [salesCount, setSalesCount] = useState(0);

  const [packVariants, setPackVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const reviewsRef = useRef(null);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      window.scrollTo(0, 0);

      const res = await fetch(`${API_BASE}/api/medicines/${id}`);
      if (!res.ok) throw new Error('Medicine not found');
      const data = await res.json();
      setMedicine(data);
      if (data.variants && data.variants.length > 0) {
        // Real DB variants — use as-is
        const mapped = data.variants.map((v, idx) => ({
          label: `${v.size}${v.weight ? ` (${v.weight})` : ''}`,
          price: v.price,
          countInStock: v.countInStock,
          isRealDbVariant: true,
          icon: idx === 0 ? '🛍️' : idx === 1 ? '📦' : '🧴',
          info: idx === 1 ? 'Save 6%' : idx === 2 ? 'Best Value' : '',
          original: v
        }));
        setPackVariants(mapped);
        setSelectedVariant(mapped[0]);
      } else {
        // No real variants — show universal quantity-bundle defaults
        const base = data.discountPrice || data.price;
        const defaults = [
          { label: '1 Unit', price: base, multiplier: 1, icon: '🛍️', info: '' },
          { label: 'Pack of 2', price: Math.round(base * 2 * 0.95), multiplier: 2, icon: '📦', info: 'Save 5%' },
          { label: 'Pack of 3', price: Math.round(base * 3 * 0.90), multiplier: 3, icon: '🧴', info: 'Best Value' },
        ].map(v => ({
          ...v,
          countInStock: data.countInStock,
          isRealDbVariant: false,
        }));
        setPackVariants(defaults);
        setSelectedVariant(defaults[0]);
      }

      if (user?.wishlist) {
        setIsWishlisted(
          user.wishlist.some(
            (item) => (item._id ? item._id.toString() : item.toString()) === id.toString()
          )
        );
      }

      // Fetch real sales stats aggregated over the last 24h
      try {
        const statsRes = await fetch(`${API_BASE}/api/medicines/${id}/sales-stats`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setSalesCount(statsData.totalSold || 0);
        }
      } catch (statsErr) {
        console.error('Error fetching sales stats:', statsErr);
      }

      const relRes = await fetch(`${API_BASE}/api/medicines/related/${id}`);
      if (relRes.ok) {
        const relData = await relRes.json();
        setRelated(Array.isArray(relData) ? relData : []);
      }
    } catch (err) {
      console.error('Error fetching medicine details:', err);
      toast.error('Medicine details could not be loaded');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        toast.error('Please login to view product details');
        navigate('/login', { state: { from: `/product/${id}` } });
        return;
      }
      fetchProductData();
    }
  }, [id, authLoading, user, navigate]);

  // Sync wishlist status if user changes
  useEffect(() => {
    if (user?.wishlist && medicine) {
      setIsWishlisted(
        user.wishlist.some(
          (item) => (item._id ? item._id.toString() : item.toString()) === medicine._id.toString()
        )
      );
    }
  }, [user, medicine]);

  const toggleWishlist = async () => {
    if (!user) {
      toast.error('Please login to use wishlist');
      navigate('/login');
      return;
    }

    const originalState = isWishlisted;
    setIsWishlisted(!isWishlisted);

    try {
      const action = originalState ? 'remove' : 'add';
      const res = await fetch(`${API_BASE}/api/users/wishlist/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id }),
      });

      if (res.ok) {
        let updatedWishlist;
        if (originalState) {
          updatedWishlist = user.wishlist.filter(
            (item) => (item._id ? item._id.toString() : item.toString()) !== id.toString()
          );
          toast.success('Removed from wishlist');
        } else {
          updatedWishlist = [...(user.wishlist || []), medicine];
          toast.success('Added to wishlist');
        }
        setUser({ ...user, wishlist: updatedWishlist });
      } else {
        throw new Error('Sync failed');
      }
    } catch (err) {
      setIsWishlisted(originalState);
      toast.error('Wishlist sync failed');
    }
  };

  const handleAddToCart = () => {
    if (!medicine) return;
    const finalProduct = { ...medicine };
    if (selectedVariant) {
      // Both real DB variants AND fallback bundle variants carry a `.price`
      finalProduct.price = selectedVariant.price;
      finalProduct.discountPrice = null;
      finalProduct.selectedVariantLabel = selectedVariant.label;
      finalProduct.countInStock = selectedVariant.countInStock;
    }
    addToCart(finalProduct, quantity);
    toast.success(`${medicine.name}${selectedVariant ? ` (${selectedVariant.label})` : ''} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    if (medicine) {
      const finalProduct = { ...medicine };
      if (selectedVariant) {
        finalProduct.price = selectedVariant.price;
        finalProduct.discountPrice = null;
        finalProduct.selectedVariantLabel = selectedVariant.label;
        finalProduct.countInStock = selectedVariant.countInStock;
      }
      navigate('/checkout', {
        state: { 
          isDirectBuy: true, 
          directItem: { 
            ...finalProduct,
            quantity 
          } 
        },
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Product link copied to clipboard!');
  };

  const jumpToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-slate-800 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-slate-400">Loading Pharmaceutical Profile...</p>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
        <h1 className="text-sm font-medium text-slate-700 uppercase tracking-widest">Product Not Found</h1>
        <button onClick={() => navigate('/medicines')} className="mt-4 border border-slate-350 text-slate-800 px-6 py-2 rounded-lg text-xs font-medium uppercase tracking-wider hover:bg-slate-50 transition-colors">
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFD] pb-24 text-slate-800 font-sans antialiased">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Understated Breadcrumbs */}
        <div className="py-4 flex items-center justify-between mb-4">
          <nav className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-widest text-slate-400">
            <Link to="/" className="hover:text-slate-650 transition-colors">Home</Link>
            <ChevronRight size={8} className="opacity-40" />
            <Link to="/medicines" className="hover:text-slate-650 transition-colors">Medicines</Link>
            <ChevronRight size={8} className="opacity-40" />
            <span className="text-slate-600 max-w-[150px] truncate italic normal-case">{medicine.name}</span>
          </nav>

          <div className="flex items-center gap-3">
            {salesCount > 0 && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-705 rounded-full border border-emerald-100/50 text-[9px] font-medium uppercase tracking-wider">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                <span>{salesCount} units sold in last 24 hrs</span>
              </div>
            )}
            
            <button 
              onClick={handleShare}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-450 hover:text-slate-700 transition-colors flex items-center gap-1.5 text-[10px] font-medium"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Main Product Hero (Wrapped in one soft-elevated card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-2xl p-6 sm:p-10 shadow-3xs border border-slate-100 mb-8">
          {/* Left: Image gallery */}
          <div className="lg:col-span-5 flex justify-center">
            <ImageGallery 
              image={medicine.image} 
              name={medicine.name}
              verifiedAuthentic={medicine.verifiedAuthentic}
              needsRx={medicine.needsRx}
              additionalImages={medicine.additionalImages}
            />
          </div>
          
          {/* Right: Info panel */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <ProductInfoPanel 
              medicine={medicine}
              selectedVariant={selectedVariant}
              packVariants={packVariants}
              setSelectedVariant={setSelectedVariant}
              quantity={quantity}
              setQuantity={setQuantity}
              handleAddToCart={handleAddToCart}
              handleBuyNow={handleBuyNow}
              jumpToReviews={jumpToReviews}
              isWishlisted={isWishlisted}
              toggleWishlist={toggleWishlist}
            />
            
            {/* Delivery Estimate Box inside the card */}
            <div className="mt-8">
              <DeliveryEstimateBlock />
            </div>
          </div>
        </div>

        {/* Quiet Trust Row (Three calm equal-width tiles below main card) */}
        <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-slate-100 mb-8 text-slate-450">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center text-xs font-normal">
            <Truck size={14} className="opacity-80" />
            <span>Free Delivery</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center text-xs font-normal border-l border-r border-slate-100">
            <RotateCcw size={14} className="opacity-80" />
            <span>Easy Returns</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center text-xs font-normal">
            <CreditCard size={14} className="opacity-80" />
            <span>Secure Payment</span>
          </div>
        </div>

        {/* Tabbed Detail Section (Separated by whitespace) */}
        <div className="mb-10">
          <ProductTabs medicine={medicine} />
        </div>

        {/* Reviews Section */}
        <div className="mb-10" ref={reviewsRef} id="reviews-section-container">
          <ReviewsSection 
            medicine={medicine}
            user={user}
            token={token}
            refreshProduct={fetchProductData}
          />
        </div>

        {/* Related Products Recommendations */}
        <div>
          <RelatedProducts products={related} />
        </div>

      </div>

      {/* Sticky Mobile Add-to-Cart Bar */}
      <StickyMobileCartBar 
        medicine={medicine}
        selectedVariant={selectedVariant}
        handleAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default ProductDetails;
