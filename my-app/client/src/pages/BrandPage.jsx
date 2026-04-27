import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MedicineCard from '../components/medicine/MedicineCard';

import { API_BASE } from '../utils/apiConfig';

const BrandPage = () => {
  const { brandName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandProducts = async () => {
      setLoading(true);

      try {
        const res = await fetch(`${API_BASE}/api/medicines`);
        const data = await res.json();

        const brandData = data.filter(
          (p) => p.brand?.toLowerCase() === brandName?.toLowerCase()
        );

        setProducts(brandData);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandProducts();
  }, [brandName]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-24">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"></div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-[3px] text-gray-500 animate-pulse">
            Loading Brand Hub...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 pb-12 pt-20 sm:pt-24 sm:pb-14">
      <h1 className="mb-6 sm:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter underline decoration-blue-500 decoration-2 sm:decoration-4 underline-offset-4">
        {brandName} <span className="text-slate-300">Hub</span>
      </h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
          {products.map((p) => (
            <MedicineCard key={p._id} {...p} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] sm:rounded-[3rem] border border-dashed border-slate-200 bg-slate-50 py-16 sm:py-20 text-center">
          <p className="px-4 text-sm sm:text-base font-bold uppercase italic text-slate-400">
            No products found for this brand yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default BrandPage;