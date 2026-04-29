import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import MedicineCard from '../components/medicine/MedicineCard';

import { API_BASE } from '../utils/apiConfig';

const Home = ({ medicines = [], featured = [], loading = true }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { token, user } = useAuth();
  const fileInputRef = useRef(null);

  const servicesScrollRef = useRef(null);
  const brandsScrollRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  
  const [dbBanners, setDbBanners] = useState([]);
  const [dbBrands, setDbBrands] = useState([]);

  useEffect(() => {
    const fetchHomeAssets = async () => {
      try {
        const [bRes, brRes] = await Promise.all([
          fetch(`${API_BASE}/api/banners`),
          fetch(`${API_BASE}/api/brands`)
        ]);
        const [bData, brData] = await Promise.all([bRes.json(), brRes.json()]);
        setDbBanners(Array.isArray(bData) ? bData : []);
        setDbBrands(Array.isArray(brData) ? brData : []);
      } catch (err) {
        console.error("Home sync failed:", err);
      }
    };
    fetchHomeAssets();
  }, []);

  const fallbackBanners = [
    {
      title: '2-Hour Express Delivery',
      desc: 'Fastest pharmacy delivery in Amritsar.',
      bg: 'bg-[#2874f0]',
      image: null
    },
    {
      title: 'Flat 25% Off on Wellness',
      desc: 'Vitamins and protein supplements at best prices.',
      bg: 'bg-green-600',
      image: null
    },
    {
      title: 'Baby Care Bonanza',
      desc: 'Top brands like Cetaphil & Himalaya available.',
      bg: 'bg-red-600',
      image: null
    },
  ];

  const activeBanners = dbBanners.length > 0 ? dbBanners : fallbackBanners;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev === activeBanners.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const fallbackBrands = [
    { name: 'himalaya', img: 'https://www.watsons.com.sg/medias/04-Brand-Story-Banner-750x530px-01-IL-01.jpg?context=bWFzdGVyfHJvb3R8NjAxNjF8aW1hZ2UvanBlZ3xoZmMvaGU1LzkwNzMyOTQyNDU5MTguanBnfGQ5ZWI3NGQyMTJkOTU5MzA5YTkzNGNjOWM2NjVhZDBiMjFkZjdkZDQzNDNhNjBhNTUwYjBiZjk3OWQyZGEwMTI' },
    { name: 'cetaphil', img: 'https://mir-s3-cdn-cf.behance.net/projects/404/fd66d1160593807.Y3JvcCw2MjcsNDkwLDEzNiw5MQ.jpg' },
    { name: 'Pilgrim', img: 'https://images.yourstory.com/cs/images/companies/Pilgrim-1624019483873.jpg' },
    { name: 'Accu-chek', img: 'https://www.logosvgpng.com/wp-content/uploads/2018/09/accu-chek-logo-vector.png' },
    { name: 'PentaSure', img: 'https://th.bing.com/th/id/R.d4bebbe9a31ce35ca40a48b8229aa163?rik=aMVwFck4mff8aQ&riu=http%3a%2f%2fpentasurenutrition.com%2fcdn%2fshop%2ffiles%2fPentaSure-logo.png%3fv%3d1718862987&ehk=%2fm4SFCnatztjh5EbTsNKewqUJpAt5lwkB7Ogmjo0eUE%3d&risl=&pid=ImgRaw&r=0' },
    { name: 'Optimum Nutrition', img: 'https://tse4.mm.bing.net/th/id/OIP.Fz9_NbeoX05Pm7ZWHwlr4wHaEK?rs=1&pid=ImgDetMain&o=7&rm=3' },
    { name: 'Prohance', img: 'https://pbs.twimg.com/profile_images/654650890335334400/oxTrSWLY_400x400.png' },
    { name: 'Tejasya', img: 'https://aniportalimages.s3.amazonaws.com/media/details/Capture_2QlQdnb.jpg' },
  ];

  const activeBrands = dbBrands.length > 0 ? dbBrands.map(b => ({ name: b.name, img: b.image })) : fallbackBrands;

  const services = [
    { title: 'Medicines', img: '💊', desc: 'Flat 25% Off', color: 'text-orange-600', path: '/medicines' },
    { title: 'Lab Tests', img: '🔬', desc: 'Up to 70% Off', color: 'text-blue-600', path: '/lab-tests' },
    { title: 'Doctor', img: '👨‍⚕️', desc: 'Online Chat', color: 'text-teal-600', path: '/consult' },
    { title: 'Ayurveda', img: '🌿', desc: 'Pure Herbal', color: 'text-green-600', path: '/ayurveda' },
    { title: 'Care Plan', img: '💳', desc: 'Extra Savings', color: 'text-red-600', path: '/care-plan' },
    { title: 'Skin Care', img: '✨', desc: 'Derm Approved', color: 'text-pink-600', path: '/skin-care' },
  ];

  const scrollHorizontally = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === 'left' ? -220 : 220,
        behavior: 'smooth',
      });
    }
  };

  const handleUploadPrescription = async () => {
    if (!user) return alert('Please Login First to upload prescriptions!');
    if (!selectedFile) return alert('Please select a file first!');

    try {
      setIsUploading(true);
      setScanResult(null);

      const formData = new FormData();
      formData.append('prescription', selectedFile);

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await fetch(`${API_BASE}/api/prescriptions/scan-and-check`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setScanResult(data.foundProduct);
        setSelectedFile(null);
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (error) {
      console.error('CRITICAL FRONTEND ERROR:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-white pt-0 sm:pt-1 md:pt-2 font-sans text-[#212121]">
      <div className="w-full">
        {/* BANNERS */}
        <section className="w-full px-3 sm:px-4 lg:px-6 py-1 sm:py-2">
          <div className="mx-auto w-full max-w-7xl">
            <div
              onClick={() => activeBanners[currentBanner].link && navigate(activeBanners[currentBanner].link)}
              className={`relative cursor-pointer h-[120px] sm:h-[180px] md:h-[260px] lg:h-[300px] overflow-hidden rounded-2xl sm:rounded-3xl text-white shadow-xl transition-all duration-700 ${activeBanners[currentBanner].bg || 'bg-slate-800'}`}
            >
              {activeBanners[currentBanner].image && (
                <img src={activeBanners[currentBanner].image} className="absolute inset-0 h-full w-full object-cover" alt="banner" />
              )}
              <div className="absolute inset-0 z-10 flex flex-col justify-center px-4 sm:px-8 md:px-12">
                <h1 className="mb-2 max-w-[95%] text-lg sm:text-3xl md:text-5xl font-black uppercase italic tracking-tight leading-tight">
                  {activeBanners[currentBanner].title}
                </h1>
                <p className="max-w-[95%] sm:max-w-md text-[10px] sm:text-base md:text-lg font-bold italic opacity-90 leading-snug">
                  {activeBanners[currentBanner].desc || activeBanners[currentBanner].title}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="w-full px-3 sm:px-4 lg:px-6 pt-2 pb-2 sm:pt-3 sm:pb-3">
          <div className="mx-auto w-full max-w-7xl rounded-2xl bg-[#f6faff] border border-[#dbeafe] p-3 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base sm:text-lg md:text-xl font-black uppercase tracking-tight text-slate-800">
                Quick Services
              </h2>
              <div className="sm:hidden flex items-center gap-2">
                <button
                  onClick={() => scrollHorizontally(servicesScrollRef, 'left')}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md text-xl font-black text-gray-600"
                >
                  ‹
                </button>
                <button
                  onClick={() => scrollHorizontally(servicesScrollRef, 'right')}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md text-xl font-black text-gray-600"
                >
                  ›
                </button>
              </div>
            </div>

            <div
              ref={servicesScrollRef}
              className="sm:hidden overflow-x-auto no-scrollbar"
            >
              <div className="flex gap-3 w-max pr-3">
                {services.map((service, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate(service.path)}
                    className="w-[31vw] min-w-[31vw] max-w-[140px] group flex cursor-pointer flex-col items-center rounded-2xl bg-white p-3 text-center border border-white shadow-sm transition-all active:scale-95"
                  >
                    <div className="mb-2 text-3xl transition-transform group-hover:scale-110">
                      {service.img}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tight leading-tight">
                      {service.title}
                    </span>
                    <span className={`text-[8px] font-bold ${service.color}`}>
                      {service.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden sm:grid grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
              {services.map((service, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(service.path)}
                  className="group flex cursor-pointer flex-col items-center rounded-2xl bg-white border border-white p-3 sm:p-4 text-center shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-2 text-3xl sm:text-4xl transition-transform group-hover:scale-110">
                    {service.img}
                  </div>
                  <span className="text-[10px] sm:text-[12px] font-black uppercase tracking-tight leading-tight">
                    {service.title}
                  </span>
                  <span className={`text-[8px] sm:text-[10px] font-bold ${service.color}`}>
                    {service.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRESCRIPTION */}
        <section className="w-full px-3 sm:px-4 lg:px-6 py-5 sm:py-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="flex flex-col">
              <div
                className={`relative overflow-hidden border border-[#FFD9B1] bg-[#FFF4E8] p-4 sm:p-6 md:p-8 transition-all duration-500 ${
                  scanResult ? 'rounded-t-2xl' : 'rounded-2xl'
                }`}
              >
                <div className="absolute -right-4 -bottom-4 select-none text-7xl sm:text-8xl md:text-9xl opacity-5 rotate-12">
                  📄
                </div>

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="z-10 flex items-start sm:items-center gap-3 sm:gap-5">
                    <div className="text-4xl sm:text-5xl">📄</div>
                    <div>
                      <h2 className="text-base sm:text-xl font-black uppercase italic text-[#4D2C00] leading-tight">
                        Order with Prescription
                      </h2>
                      <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-tight text-[#8B5E3C]">
                        Verified pharmacists will review your order
                      </p>
                    </div>
                  </div>

                  <div className="z-10 flex w-full flex-col gap-3 md:w-auto md:items-end">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        accept="image/*,.pdf"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                      />

                      <button
                        onClick={() => fileInputRef.current.click()}
                        className={`w-full sm:w-auto rounded-lg border-2 px-4 sm:px-6 md:px-8 py-3 text-[10px] sm:text-xs font-black uppercase transition-all ${
                          selectedFile
                            ? 'border-green-500 bg-green-50 text-green-600'
                            : 'border-[#ff6f61] bg-white text-[#ff6f61] hover:bg-[#fff5f4]'
                        }`}
                      >
                        {selectedFile ? '📎 Change File' : 'Select Prescription'}
                      </button>

                      <button
                        onClick={handleUploadPrescription}
                        disabled={isUploading || !selectedFile}
                        className={`w-full sm:w-auto rounded-lg px-5 sm:px-8 md:px-10 py-3 text-[10px] sm:text-xs font-black uppercase shadow-lg transition-all ${
                          !selectedFile
                            ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                            : 'bg-[#ff6f61] text-white hover:bg-[#e65a50] active:scale-95'
                        }`}
                      >
                        {isUploading ? 'Scanning...' : 'Upload Now'}
                      </button>
                    </div>

                    {selectedFile && (
                      <div className="flex w-full sm:w-auto items-center gap-2 rounded-full border border-[#FFD9B1] bg-white/50 px-3 py-1">
                        <span className="truncate text-[9px] sm:text-[10px] font-black uppercase italic text-[#4D2C00] max-w-[220px] sm:max-w-[260px]">
                          Selected:{' '}
                          {selectedFile.name.length > 20
                            ? selectedFile.name.substring(0, 20) + '...'
                            : selectedFile.name}
                        </span>
                        <button
                          onClick={() => setSelectedFile(null)}
                          className="text-xs font-bold text-red-500"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {scanResult && (
                <div className="animate-fadeIn flex flex-col gap-5 rounded-b-2xl border-x border-b border-[#FFD9B1] bg-white p-4 sm:p-6 shadow-xl md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                    <div className="h-20 w-20 overflow-hidden rounded-xl border bg-gray-50 p-2">
                      <img
                        src={scanResult.image}
                        alt={scanResult.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase text-green-700">
                          Medicine Found
                        </span>
                      </div>
                      <h4 className="mt-1 text-base sm:text-lg font-black uppercase text-gray-800">
                        {scanResult.name}
                      </h4>
                      <p className="text-[9px] sm:text-[10px] font-bold uppercase text-gray-400 break-words">
                        {scanResult.brand} | {scanResult.category}
                      </p>
                      <p className="mt-1 text-lg sm:text-xl font-black text-[#ff6f61]">
                        ₹{scanResult.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:gap-4">
                    <button
                      onClick={() => {
                        addToCart(scanResult);
                        setScanResult(null);
                      }}
                      className="w-full sm:w-auto rounded-lg bg-[#2874f0] px-6 sm:px-8 md:px-10 py-3 text-[10px] sm:text-xs font-black uppercase text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => setScanResult(null)}
                      className="self-center px-2 text-gray-300 hover:text-red-500"
                    >
                      <span className="text-2xl font-bold">✕</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* DAILY DEALS */}
        <section id="daily-deals" className="w-full px-3 sm:px-4 lg:px-6 py-5 sm:py-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="sm:hidden mb-4 overflow-hidden rounded-2xl bg-gradient-to-r from-[#ff6f61] via-[#ff8a65] to-[#ffb74d] p-4 text-white shadow-lg">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-90">
                Daily Deals
              </p>
              <h3 className="mt-1 text-xl font-black uppercase italic leading-tight">
                Flash Sale
              </h3>
              <p className="mt-1 text-[11px] font-bold opacity-90">
                Best offers on top medicines and wellness products
              </p>
            </div>

            <h3 className="hidden sm:block mb-5 sm:mb-6 text-lg sm:text-xl font-black uppercase italic tracking-tighter">
              Daily Flash Deals
            </h3>

            {loading ? (
              <>
                <div className="grid grid-cols-4 gap-2 sm:hidden">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div key={item} className="rounded-xl bg-gray-100 p-2 animate-pulse">
                      <div className="aspect-square w-full rounded-lg bg-gray-200" />
                      <div className="mt-1 h-3 rounded bg-gray-200" />
                    </div>
                  ))}
                </div>

                <div className="hidden sm:block overflow-x-auto no-scrollbar pb-2">
                  <div className="flex gap-4 w-max">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="h-48 w-[220px] rounded-2xl bg-gray-100 animate-pulse" />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="sm:hidden rounded-2xl bg-[#fff7f5] p-3 shadow-sm border border-[#ffe1dc]">
                  <div className="grid grid-cols-4 gap-2">
                    {featured.slice(0, 8).map((med) => (
                      <div
                        key={med._id}
                        onClick={() => navigate(`/product/${med._id}`)}
                        className="cursor-pointer rounded-xl bg-white p-2 shadow-sm border border-gray-100 active:scale-[0.98] transition"
                      >
                        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center p-1.5">
                          <img
                            src={
                              med.image ||
                              `https://placehold.co/300x300/f3f4f6/3b82f6?text=${med.name || 'Medicine'}`
                            }
                            alt={med.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <p className="mt-1 text-[8px] font-bold leading-tight text-center text-gray-700 line-clamp-2 min-h-[22px]">
                          {med.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="hidden sm:block">
                  <div className="overflow-x-auto no-scrollbar pb-2">
                    <div className="flex gap-4 w-max">
                      {featured.map((med) => (
                        <div key={med._id} className="w-[220px] md:w-[240px] lg:w-[260px] shrink-0">
                          <MedicineCard {...med} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* BRANDS */}
        <section className="w-full px-3 sm:px-4 lg:px-6 py-6 sm:py-12">
          <div className="mx-auto w-full max-w-7xl rounded-2xl bg-[#fff7f7] border border-[#ffe4e6] p-3 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base sm:text-lg md:text-xl font-black text-[#212121]">
                Featured Brands
              </h2>
              <div className="sm:hidden flex items-center gap-2">
                <button
                  onClick={() => scrollHorizontally(brandsScrollRef, 'left')}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md text-xl font-black text-gray-600"
                >
                  ‹
                </button>
                <button
                  onClick={() => scrollHorizontally(brandsScrollRef, 'right')}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md text-xl font-black text-gray-600"
                >
                  ›
                </button>
              </div>
            </div>

            <div
              ref={brandsScrollRef}
              className="sm:hidden overflow-x-auto no-scrollbar"
            >
              <div className="flex gap-3 w-max pr-3">
                {activeBrands.map((brand, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate(`/brand/${brand.name}`)}
                    className="w-[31vw] min-w-[31vw] max-w-[130px] group flex cursor-pointer flex-col items-center"
                  >
                    <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-white bg-white p-2 shadow-sm transition-shadow group-hover:shadow-md">
                      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white shadow-inner">
                        <img
                          src={brand.img}
                          alt={brand.name}
                          className="h-[85%] w-[85%] object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    <span className="mt-2 text-center text-[8px] font-bold uppercase text-gray-500 break-words leading-tight">
                      {brand.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden sm:grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-8">
              {activeBrands.map((brand, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/brand/${brand.name}`)}
                  className="group flex cursor-pointer flex-col items-center min-w-0"
                >
                  <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-white bg-white p-2 shadow-sm transition-shadow group-hover:shadow-md">
                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white shadow-inner">
                      <img
                        src={brand.img}
                        alt={brand.name}
                        className="h-[85%] w-[85%] object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <span className="mt-2 text-center text-[9px] sm:text-[10px] font-bold uppercase text-gray-500 break-words">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BESTSELLERS */}
       {/* BESTSELLERS */}
<section className="w-full px-3 sm:px-4 lg:px-6 py-8 sm:py-12">
  <div className="mx-auto w-full max-w-7xl rounded-2xl border border-[#e9e5ff] bg-[#f8f7ff] p-4 sm:p-6">
    <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <h3 className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter leading-none">
        Bestsellers in Amritsar Hub
      </h3>
      <button
        onClick={() => navigate('/medicines')}
        className="self-start text-[10px] sm:text-xs font-black uppercase text-[#ff6f61] underline"
      >
        View All Categories
      </button>
    </div>

    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {medicines.slice(0, 10).map((med) => (
        <div key={med._id} className="group flex min-w-0 flex-col">
          <MedicineCard {...med} />
          <div
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/medicines?category=${med.category || 'All'}`);
            }}
            className="mt-2 cursor-pointer text-center text-[8px] sm:text-[9px] font-black uppercase text-blue-500 opacity-100 sm:opacity-0 transition-opacity hover:underline sm:group-hover:opacity-100"
          >
            View similar in {med.category} →
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
      </div>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Home;