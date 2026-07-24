import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../utils/apiConfig';
import CategoryTabBar from './CategoryTabBar';
import HeroBannerCarousel from './HeroBannerCarousel';
import QuickAccessGrid from './QuickAccessGrid';
import FlashDealsRow from './FlashDealsRow';
import PersonalizedSection from './PersonalizedSection';
import RecentlyViewed from './RecentlyViewed';
import ProductScrollRow from './ProductScrollRow';
import { MobileProductCard } from './ProductScrollRow';
import { Loader2 } from 'lucide-react';

const MobileHomeView = ({ medicines = [], featured = [], loading = false }) => {
  const { token, user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('for-you');
  const [activeFilter, setActiveFilter] = useState('');
  
  // Category specific products (for non-for-you tabs)
  const [catProducts, setCatProducts] = useState([]);
  const [isCatLoading, setIsCatLoading] = useState(false);

  // Banners from API
  const [dbBanners, setDbBanners] = useState([]);
  const [isBannerLoading, setIsBannerLoading] = useState(true);

  // Recommendation products
  const [orderBasedRecs, setOrderBasedRecs] = useState([]);

  // Fetch Banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/banners`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setDbBanners(data);
          }
        }
      } catch (err) {
        console.error("Banner fetch failed", err);
      } finally {
        setIsBannerLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Fetch Order-Based Recommendations
  useEffect(() => {
    if (!token) {
      setOrderBasedRecs([]);
      return;
    }
    const fetchRecommendations = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/customers/recommendations/based-on-orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setOrderBasedRecs(data);
          }
        }
      } catch (err) {
        console.error("Error loading order-based recommendations", err);
      }
    };
    fetchRecommendations();
  }, [token]);

  // Fetch or filter products when active tab changes
  useEffect(() => {
    if (activeTab === 'for-you') return;

    // Map activeTab to category search key
    let catQuery = activeTab;
    if (activeTab === 'wellness') catQuery = 'immunity'; // Map wellness to immunity/boosters

    setIsCatLoading(true);
    const fetchCategoryProducts = async () => {
      try {
        // Try searching in localized medicines prop first to make it instant
        const matched = medicines.filter(m => 
          m.category?.toLowerCase() === catQuery || 
          m.category?.toLowerCase().includes(catQuery)
        );

        if (matched.length > 0) {
          setCatProducts(matched);
          setIsCatLoading(false);
        } else {
          // Fallback to API call
          const res = await fetch(`${API_BASE}/api/medicines?category=${encodeURIComponent(catQuery)}`);
          if (res.ok) {
            const data = await res.json();
            const results = Array.isArray(data) ? data : (data?.medicines || []);
            setCatProducts(results);
          }
        }
      } catch (err) {
        console.error("Error loading category products", err);
      } finally {
        setIsCatLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [activeTab, medicines]);

  const mainBanners = dbBanners.filter(b => b.category === 'main' && b.isActive !== false);

  // Group real products for horizontal scroll rows
  const trendingProducts = medicines.filter(m => m.isTrending && m.isActive !== false);
  const skinCareProducts = medicines.filter(m => m.category?.toLowerCase() === 'skin-care' && m.isActive !== false);
  const immunityProducts = medicines.filter(m => (m.category?.toLowerCase() === 'immunity' || m.category?.toLowerCase() === 'wellness') && m.isActive !== false);

  const handleTabChange = (tabId, filter) => {
    setActiveTab(tabId);
    setActiveFilter(filter);
  };

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen">
      {/* Category Tab Bar (Horizontal Scroll, Below Search) */}
      <CategoryTabBar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main content body with top padding to clear category tab bar */}
      <div className="pt-16">
        {activeTab === 'for-you' ? (
          <div className="space-y-3 pb-8">
            {/* Carousel */}
            <div className="px-4 pt-3">
              <HeroBannerCarousel banners={mainBanners} loading={isBannerLoading} />
            </div>

            {/* Quick Access Tiles */}
            <QuickAccessGrid />

            {/* Flash Deals with Countdown */}
            <FlashDealsRow />

            {/* Still looking for these? (Personalized section) */}
            <PersonalizedSection />

            {/* Based on past orders recommendations */}
            {orderBasedRecs.length > 0 && (
              <ProductScrollRow 
                title="Based on your orders" 
                products={orderBasedRecs}
              />
            )}

            {/* Recently Viewed */}
            <RecentlyViewed />

            {/* Trending medicines row */}
            <ProductScrollRow 
              title="Trending Medicines" 
              products={trendingProducts.length > 0 ? trendingProducts : medicines.slice(0, 8)}
              seeAllLink="/medicines?filter=trending"
            />

            {/* Skin Care picks row */}
            <ProductScrollRow 
              title="Skin Care Picks" 
              products={skinCareProducts.length > 0 ? skinCareProducts : medicines.filter(m => m.category === 'Skin care').slice(0, 8)}
              seeAllLink="/medicines?filter=skin-care"
            />

            {/* Immunity boosters row */}
            <ProductScrollRow 
              title="Immunity Boosters" 
              products={immunityProducts.length > 0 ? immunityProducts : medicines.filter(m => m.category === 'Immunity Boosters').slice(0, 8)}
              seeAllLink="/medicines?filter=immunity"
            />
          </div>
        ) : (
          /* Active Category View (2-Column Grid) */
          <div className="p-4 pb-8 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Browsing {activeTab.replace('-', ' ')}
              </h2>
              <span className="text-[10px] font-black bg-teal-50 text-[#00a2a4] px-2 py-0.5 rounded-full">
                {catProducts.length} Items Found
              </span>
            </div>

            {isCatLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="animate-spin text-[#00a2a4]" size={28} />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Products...</span>
              </div>
            ) : catProducts.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl">
                <p className="text-sm font-bold text-slate-500">No medicines found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3.5">
                {catProducts.map((product) => (
                  <MobileProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileHomeView;
