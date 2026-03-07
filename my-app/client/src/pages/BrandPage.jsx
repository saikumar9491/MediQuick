import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MedicineCard from '../components/medicine/MedicineCard';

const BrandPage = () => {
  const { brandName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading status

  useEffect(() => {
    const fetchBrandProducts = async () => {
      setLoading(true);
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_BASE}/api/medicines`);
        const data = await res.json();
        
        // Use optional chaining (?.) to prevent crashes if 'p.brand' is missing
        const brandData = data.filter(p => p.brand?.toLowerCase() === brandName?.toLowerCase());
        setProducts(brandData);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrandProducts();
  }, [brandName]);

  if (loading) return <div className="pt-32 text-center font-black animate-pulse">LOADING BRAND HUB...</div>;

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-4xl md:text-6xl font-black uppercase italic mb-8 underline decoration-blue-500 tracking-tighter">
        {brandName} <span className="text-slate-300">Hub</span>
      </h1>
      
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {products.map(p => <MedicineCard key={p._id} {...p} />)}
        </div>
      ) : (
        <div className="py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
          <p className="text-slate-400 font-bold italic uppercase">No products found for this brand yet.</p>
        </div>
      )}
    </div>
  );
};

export default BrandPage;