import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import MedicineCard from '../components/medicine/MedicineCard';

const Home = () => {
  const navigate = useNavigate();
  const { addToCart, showNotification } = useCart();
  const fileInputRef = useRef(null);
  
  // State Management
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [featured, setFeatured] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  // 1. TATA 1MG STYLE BANNER DATA
  const banners = useMemo(() => [
    { title: "2-Hour Express Delivery", desc: "Fastest pharmacy delivery in Amritsar.", bg: "bg-[#2874f0]", code: "QUICK20" },
    { title: "Flat 25% Off on Wellness", desc: "Vitamins and protein supplements at best prices.", bg: "bg-green-600", code: "HEALTHY25" },
    { title: "Baby Care Bonanza", desc: "Top brands like Cetaphil & Himalaya available.", bg: "bg-red-600", code: "BABYCARE" }
  ], []);

  // 2. BRAND DATA
  const brandLogos = [
    { name: "Pilgrim", img: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/e8e604d5-072e-4b77-8051-9310a08e6587.png" },
    { name: "Dr. Morepen", img: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/6ec7a4f5-9377-4959-992e-360e676104bc.png" },
    { name: "Miduty", img: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/8b46e9df-9884-482d-8007-881b212f0290.png" },
    { name: "Omron", img: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/72574e4c-1e81-432d-82d2-83b53c713b1d.png" },
    { name: "PentaSure", img: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/43773177-3e2b-435f-846c-2f941198642a.png" },
    { name: "Optimum Nutrition", img: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/d6f4661a-283e-4d4b-97e3-0c460d3d5f57.png" },
    { name: "Prohance", img: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/80d07525-412f-48e0-a430-671c08007323.png" },
    { name: "Tejasya", img: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/273d6118-977a-426b-967b-232506e76315.png" }
  ];

  // 3. SERVICE GRID DATA - UPDATED WITH PATHS
  const services = [
    { title: "Medicines", img: "💊", desc: "Flat 25% Off", color: "text-orange-600", path: "/medicines" },
    { title: "Lab Tests", img: "🔬", desc: "Up to 70% Off", color: "text-blue-600", path: "/lab-tests" },
    { title: "Consult Doctor", img: "👨‍⚕️", desc: "Online Chat", color: "text-teal-600", path: "/consult" },
    { title: "Ayurveda", img: "🌿", desc: "Pure Herbal", color: "text-green-600", path: "/ayurveda" },
    { title: "Care Plan", img: "💳", desc: "Extra Savings", color: "text-red-600", path: "/care-plan" },
    { title: "Skin Care", img: "✨", desc: "Dermatologist Approved", color: "text-pink-600", path: "/skin-care" },
  ];

  // Fetch Logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const [allRes, topRes] = await Promise.all([
          fetch(`${API_BASE}/api/medicines`),
          fetch(`${API_BASE}/api/medicines/top`)
        ]);
        const allData = await allRes.json();
        const topData = await topRes.json();
        setMedicines(allData);
        setFeatured(topData);
      } catch (err) {
        console.error("Hub data sync failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleUploadPrescription = async () => {
    if (!selectedFile) return alert("Select a file first!");
    setIsUploading(true);
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const formData = new FormData();
    formData.append('prescription', selectedFile);
    try {
      const response = await fetch(`${API_BASE}/api/prescriptions/scan-and-check`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setScanResult(data);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Scan error", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#212121]">
      
      {/* 1. AUTO-ROTATING BANNERS */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className={`relative h-[180px] md:h-[280px] rounded-2xl overflow-hidden text-white shadow-xl transition-all duration-700 ${banners[currentBanner].bg}`}>
          <div className="absolute inset-0 flex flex-col justify-center px-12 z-10">
            <h1 className="text-3xl md:text-5xl font-black mb-2 italic uppercase tracking-tighter leading-none">{banners[currentBanner].title}</h1>
            <p className="text-lg opacity-90 max-w-md font-bold italic">{banners[currentBanner].desc}</p>
          </div>
        </div>
      </div>

      {/* 2. SERVICE GRID - NAVIGATION LOGIC ADDED */}
      <div className="max-w-7xl mx-auto px-4 py-2 grid grid-cols-3 md:grid-cols-6 gap-4 border-b border-gray-100">
        {services.map((service, idx) => (
          <div 
            key={idx} 
            onClick={() => navigate(service.path)} // TRIGGERS NAVIGATION
            className="cursor-pointer flex flex-col items-center p-4 hover:shadow-md rounded-xl transition-all group"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{service.img}</div>
            <span className="text-[12px] font-black uppercase tracking-tight">{service.title}</span>
            <span className={`text-[10px] font-bold ${service.color}`}>{service.desc}</span>
          </div>
        ))}
      </div>

      {/* 3. QUICK UPLOAD STRIP */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-[#FFF4E8] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#FFD9B1]">
          <div className="flex items-center gap-6">
            <div className="text-5xl">📄</div>
            <h2 className="text-xl font-black italic uppercase text-[#4D2C00]">Order with Prescription</h2>
          </div>
          <div className="flex gap-4">
            <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => setSelectedFile(e.target.files[0])} />
            <button onClick={() => fileInputRef.current.click()} className="bg-white border-2 border-[#ff6f61] text-[#ff6f61] px-8 py-3 rounded-lg font-black text-xs uppercase">
              {selectedFile ? "Ready" : "Select Prescription"}
            </button>
            <button onClick={handleUploadPrescription} disabled={isUploading} className="bg-[#ff6f61] text-white px-10 py-3 rounded-lg font-black text-xs uppercase shadow-lg">
              {isUploading ? "Scanning..." : "Upload Now"}
            </button>
          </div>
        </div>
      </div>

      {/* 4. DAILY DEALS */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h3 className="text-xl font-black italic uppercase tracking-tighter mb-6">Daily Flash Deals</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {featured.map((med) => (
            <div key={med._id}>
              <MedicineCard {...med} />
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURED BRANDS */}
      <section className="max-w-7xl mx-auto px-4 py-12 bg-gray-50/50">
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
          <h2 className="text-xl font-bold text-[#212121]">Featured brands</h2>
          <button onClick={() => navigate('/medicines')} className="text-[#ff6f61] font-bold text-xs uppercase border border-[#ff6f61] px-3 py-1 rounded">See All</button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {brandLogos.map((brand, idx) => (
            <div key={idx} onClick={() => navigate(`/brand/${brand.name}`)} className="cursor-pointer group flex flex-col items-center">
              <div className="w-full aspect-square bg-white border border-gray-100 rounded-lg flex items-center justify-center p-2 shadow-sm group-hover:shadow-md transition-shadow">
                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white shadow-inner">
                  <img src={brand.img} alt={brand.name} className="w-[85%] h-[85%] object-contain group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <span className="mt-2 text-[10px] font-bold text-gray-500 uppercase text-center">{brand.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BESTSELLERS */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-8">
          <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Bestsellers in Amritsar Hub</h3>
          <button onClick={() => navigate('/medicines')} className="text-[#ff6f61] font-black text-xs uppercase underline">View All Categories</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {medicines.slice(0, 10).map((med) => (
            <div key={med._id} className="group flex flex-col">
              <MedicineCard {...med} />
              <div 
                onClick={(e) => {
                    e.stopPropagation(); 
                    navigate(`/medicines?category=${med.category || 'All'}`);
                }}
                className="mt-2 text-[9px] font-black text-blue-500 uppercase opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:underline text-center"
              >
                View similar in {med.category} →
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

    </div>
  );
};

export default Home;