import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import MedicineCard from '../components/medicine/MedicineCard';

const Home = () => {
  const navigate = useNavigate();
  const { addToCart, showNotification } = useCart();
  const { token, user } = useAuth();
  const fileInputRef = useRef(null);
  
  // State Management
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [scanResult, setScanResult] = useState(null); // Used for the dropdown
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
    { name: "himalaya", img: "https://www.watsons.com.sg/medias/04-Brand-Story-Banner-750x530px-01-IL-01.jpg?context=bWFzdGVyfHJvb3R8NjAxNjF8aW1hZ2UvanBlZ3xoZmMvaGU1LzkwNzMyOTQyNDU5MTguanBnfGQ5ZWI3NGQyMTJkOTU5MzA5YTkzNGNjOWM2NjVhZDBiMjFkZjdkZDQzNDNhNjBhNTUwYjBiZjk3OWQyZGEwMTI" },
    { name: "cetaphil", img: "https://mir-s3-cdn-cf.behance.net/projects/404/fd66d1160593807.Y3JvcCw2MjcsNDkwLDEzNiw5MQ.jpg" },
    { name: "Pilgrim", img: "https://images.yourstory.com/cs/images/companies/Pilgrim-1624019483873.jpg" },
    { name: "Accu-chek", img: "https://www.logosvgpng.com/wp-content/uploads/2018/09/accu-chek-logo-vector.png" },
    { name: "PentaSure", img: "https://th.bing.com/th/id/R.d4bebbe9a31ce35ca40a48b8229aa163?rik=aMVwFck4mff8aQ&riu=http%3a%2f%2fpentasurenutrition.com%2fcdn%2fshop%2ffiles%2fPentaSure-logo.png%3fv%3d1718862987&ehk=%2fm4SFCnatztjh5EbTsNKewqUJpAt5lwkB7Ogmjo0eUE%3d&risl=&pid=ImgRaw&r=0" },
    { name: "Optimum Nutrition", img: "https://tse4.mm.bing.net/th/id/OIP.Fz9_NbeoX05Pm7ZWHwlr4wHaEK?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { name: "Prohance", img: "https://pbs.twimg.com/profile_images/654650890335334400/oxTrSWLY_400x400.png" },
    { name: "Tejasya", img: "https://aniportalimages.s3.amazonaws.com/media/details/Capture_2QlQdnb.jpg" }
  ];

  // 3. SERVICE GRID DATA
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
    if (!user) return alert("Please Login First to upload prescriptions!"); 
    if (!selectedFile) return alert("Please select a file first!");

    try {
      setIsUploading(true);
      setScanResult(null); // Reset previous scan
      
      const formData = new FormData();
      formData.append('prescription', selectedFile); 

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_BASE}/api/prescriptions/scan-and-check`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` 
        },
        body: formData, 
      });

      const data = await response.json();

      if (response.ok) {
         // Successfully found medicine, set it to show dropdown
         setScanResult(data.foundProduct);
         setSelectedFile(null); 
      } else {
         alert("Upload failed: " + data.message);
      }
    } catch (error) {
      console.error("CRITICAL FRONTEND ERROR:", error);
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

      {/* 2. SERVICE GRID */}
      <div className="max-w-7xl mx-auto px-4 py-2 grid grid-cols-3 md:grid-cols-6 gap-4 border-b border-gray-100">
        {services.map((service, idx) => (
          <div 
            key={idx} 
            onClick={() => navigate(service.path)} 
            className="cursor-pointer flex flex-col items-center p-4 hover:shadow-md rounded-xl transition-all group"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{service.img}</div>
            <span className="text-[12px] font-black uppercase tracking-tight">{service.title}</span>
            <span className={`text-[10px] font-bold ${service.color}`}>{service.desc}</span>
          </div>
        ))}
      </div>

      {/* 3. QUICK UPLOAD STRIP WITH RESULT DROPDOWN */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col">
          <div className={`bg-[#FFF4E8] p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#FFD9B1] relative overflow-hidden transition-all duration-500 ${scanResult ? 'rounded-t-2xl' : 'rounded-2xl'}`}>
            
            <div className="absolute -right-4 -bottom-4 opacity-5 text-9xl transform rotate-12 select-none">📄</div>

            <div className="flex items-center gap-6 z-10">
              <div className="text-5xl drop-shadow-md">📄</div>
              <div>
                <h2 className="text-xl font-black italic uppercase text-[#4D2C00]">Order with Prescription</h2>
                <p className="text-[10px] font-bold text-[#8B5E3C] uppercase tracking-tighter">Verified pharmacists will review your order</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 z-10">
              <div className="flex gap-4">
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  accept="image/*,.pdf"
                  onChange={(e) => setSelectedFile(e.target.files[0])} 
                />
                
                <button 
                  onClick={() => fileInputRef.current.click()} 
                  className={`px-8 py-3 rounded-lg font-black text-xs uppercase transition-all border-2 ${
                    selectedFile ? "bg-green-50 border-green-500 text-green-600" : "bg-white border-[#ff6f61] text-[#ff6f61] hover:bg-[#fff5f4]"
                  }`}
                >
                  {selectedFile ? "📎 Change File" : "Select Prescription"}
                </button>

                <button 
                  onClick={handleUploadPrescription} 
                  disabled={isUploading || !selectedFile} 
                  className={`px-10 py-3 rounded-lg font-black text-xs uppercase shadow-lg transition-all ${
                    !selectedFile ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#ff6f61] text-white hover:bg-[#e65a50] active:scale-95"
                  }`}
                >
                  {isUploading ? "Scanning..." : "Upload Now"}
                </button>
              </div>

              {selectedFile && (
                <div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full border border-[#FFD9B1] animate-bounce-short">
                  <span className="text-[10px] font-black text-[#4D2C00] uppercase italic">
                    Selected: {selectedFile.name.length > 20 ? selectedFile.name.substring(0, 20) + "..." : selectedFile.name}
                  </span>
                  <button onClick={() => setSelectedFile(null)} className="text-red-500 font-bold text-xs hover:scale-125 transition-transform">✕</button>
                </div>
              )}
            </div>
          </div>

          {/* MEDICINE RESULT DROPDOWN */}
          {scanResult && (
            <div className="bg-white border-x border-b border-[#FFD9B1] rounded-b-2xl p-6 shadow-xl animate-fadeIn flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border p-2">
                  <img src={scanResult.image} alt={scanResult.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-black uppercase">Medicine Found</span>
                  </div>
                  <h4 className="text-lg font-black uppercase text-gray-800 mt-1">{scanResult.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{scanResult.brand} | {scanResult.category}</p>
                  <p className="text-xl font-black text-[#ff6f61] mt-1">₹{scanResult.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => { addToCart(scanResult); setScanResult(null); }}
                  className="bg-[#2874f0] text-white px-10 py-3 rounded-lg font-black text-xs uppercase shadow-lg hover:bg-blue-700 transition-all active:scale-95"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={() => setScanResult(null)}
                  className="text-gray-300 hover:text-red-500 transition-colors px-2"
                >
                  <span className="text-2xl font-bold">✕</span>
                </button>
              </div>
            </div>
          )}
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
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-bounce-short { animation: bounce 1s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
      `}</style>

    </div>
  );
};

export default Home;