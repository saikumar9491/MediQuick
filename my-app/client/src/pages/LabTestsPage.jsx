import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Truck, 
  FlaskConical, 
  Stethoscope, 
  BadgeCheck,
  PhoneCall,
  ShoppingBag,
  ArrowRight,
  Filter,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LabTestsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { name: 'All', icon: <FlaskConical size={18} /> },
    { name: 'Full Body Checkup', icon: <Stethoscope size={18} /> },
    { name: 'Blood Tests', icon: <Activity size={18} /> },
    { name: 'Diabetes', icon: <ShieldCheck size={18} /> },
    { name: 'Thyroid', icon: <Activity size={18} /> },
    { name: 'Vitamin Tests', icon: <ShieldCheck size={18} /> }
  ];

  const popularTests = [
    {
      id: 'cbc-test',
      name: 'CBC Test (Complete Blood Count)',
      desc: 'Measures red & white cells and platelets. Essential for overall health check.',
      price: 299,
      mrp: 500,
      category: 'Blood Tests',
      parameters: 18,
      time: '24 Hours',
      image: 'https://i.pinimg.com/1200x/2a/25/0a/2a250a52241e895241cc1ec5f4bf4b4f.jpg'
    },
    {
      id: 'thyroid-profile',
      name: 'Thyroid Profile (Total T3, T4, TSH)',
      desc: 'Checks how well your thyroid gland is working and helps diagnose thyroid disorders.',
      price: 499,
      mrp: 1200,
      category: 'Thyroid',
      parameters: 3,
      time: '24 Hours',
      image: 'https://i.pinimg.com/1200x/2a/25/0a/2a250a52241e895241cc1ec5f4bf4b4f.jpg'
    },
    {
      id: 'diabetes-screening',
      name: 'Diabetes Screening (HbA1c & Sugar)',
      desc: 'Monitor blood sugar levels over 3 months and daily fasting sugar.',
      price: 399,
      mrp: 800,
      category: 'Diabetes',
      parameters: 2,
      time: '12 Hours',
      image: 'https://i.pinimg.com/1200x/2a/25/0a/2a250a52241e895241cc1ec5f4bf4b4f.jpg'
    },
    {
      id: 'vitamin-d-test',
      name: 'Vitamin D (25-Hydroxy)',
      desc: 'Checks for vitamin D deficiency which can cause bone and muscle pain.',
      price: 899,
      mrp: 1500,
      category: 'Vitamin Tests',
      parameters: 1,
      time: '36 Hours',
      image: 'https://i.pinimg.com/1200x/2a/25/0a/2a250a52241e895241cc1ec5f4bf4b4f.jpg'
    },
    {
      id: 'full-body-plus',
      name: 'Full Body Checkup - Platinum',
      desc: 'Comprehensive 90+ tests including heart, liver, kidney, vitamins and minerals.',
      price: 1999,
      mrp: 4500,
      category: 'Full Body Checkup',
      parameters: 92,
      time: '48 Hours',
      image: 'https://i.pinimg.com/1200x/2a/25/0a/2a250a52241e895241cc1ec5f4bf4b4f.jpg'
    }
  ];

  const trustPoints = [
    { title: 'Certified Labs', desc: 'ISO & NABL Accredited Diagnostics', icon: <BadgeCheck className="text-[#00a2a4]" /> },
    { title: 'Home Sample Collection', desc: 'Free collection from your doorstep', icon: <Truck className="text-[#00a2a4]" /> },
    { title: 'Fast Reports', desc: 'Digital reports delivered within 24-48h', icon: <Clock className="text-[#00a2a4]" /> },
    { title: 'Affordable Prices', desc: 'Save up to 70% compared to hospitals', icon: <ShieldCheck className="text-[#00a2a4]" /> }
  ];

  const filteredTests = popularTests.filter(test => {
    const matchesCategory = activeCategory === 'All' || test.category === activeCategory;
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-20 sm:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 1. Header Section */}
        <section className="mb-6 sm:mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-slate-800 md:text-5xl"
          >
            Book Lab Tests & <span className="text-[#00a2a4]">Health Checkups</span>
          </motion.h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-bold uppercase tracking-widest text-slate-400">
            Certified home sample collection in 60 minutes. Get digital reports within 24 hours.
          </p>

          <div className="mx-auto mt-10 max-w-2xl">
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#00a2a4] transition-colors">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search tests like Blood Test, Thyroid, Sugar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-2xl border-none bg-white py-5 pl-14 pr-5 text-sm font-bold shadow-xl shadow-slate-200/50 outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-[#00a2a4] transition-all"
              />
            </div>
          </div>
        </section>

        {/* 7. Offers Section */}
        <section className="mb-8 sm:mb-16">
          <div className="rounded-2xl sm:rounded-[2rem] bg-gradient-to-r from-[#00a2a4] to-teal-700 p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-black/10 blur-3xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="mb-2 inline-block rounded-full bg-white/20 px-4 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                  Limited Time Offer
                </span>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter sm:text-4xl">
                  Flat 20% Off on Full Body Checkups
                </h2>
                <p className="mt-2 text-sm font-bold text-teal-50 opacity-90 uppercase tracking-widest">
                  Use Code: <span className="rounded bg-white px-2 py-0.5 text-teal-800">HEALTH20</span>
                </p>
              </div>
              <button className="rounded-xl bg-white px-8 py-4 text-xs font-black uppercase tracking-widest text-[#00a2a4] shadow-xl hover:bg-teal-50 transition-colors">
                Redeem Offer
              </button>
            </div>
          </div>
        </section>

        {/* 2. Categories (Filter Section) */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Filter size={16} className="text-[#00a2a4]" />
            <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800">Browse by Category</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar-hidden">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex shrink-0 items-center gap-3 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat.name
                    ? 'bg-[#00a2a4] text-white shadow-xl shadow-teal-100'
                    : 'bg-white text-slate-500 border border-slate-100 hover:border-[#00a2a4] hover:text-[#00a2a4]'
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* 3. Popular Tests Section */}
        <section className="mb-12 sm:mb-20">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-black uppercase italic tracking-tight text-slate-800">
              Popular <span className="text-[#00a2a4]">Diagnostic Tests</span>
            </h2>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {filteredTests.length} Tests Available
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTests.map((test) => (
              <motion.div
                layout
                key={test.id}
                className="group relative flex flex-col sm:flex-row md:flex-col overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-slate-50 bg-white shadow-sm transition-all hover:border-[#00a2a4] hover:shadow-2xl hover:shadow-teal-100"
              >
                {/* Image Header */}
                <div className="h-32 sm:h-48 w-full sm:w-1/3 md:w-full overflow-hidden bg-teal-50 shrink-0">
                  <img 
                    src={test.image} 
                    alt={test.name} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                </div>

                {/* Content Section */}
                <div className="flex flex-col p-4 sm:p-6 flex-1">
                  <div className="mb-2 sm:mb-4 flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#00a2a4]">{test.category}</span>
                      <span className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded w-fit">
                        <Clock size={10} /> {test.time}
                      </span>
                    </div>
                  </div>

                  <h3 className="mb-1 sm:mb-2 text-sm sm:text-lg font-black uppercase italic tracking-tight text-slate-800 group-hover:text-[#00a2a4] leading-tight">
                    {test.name}
                  </h3>
                  <p className="mb-3 sm:mb-6 text-[10px] sm:text-[11px] font-bold leading-relaxed text-slate-400 line-clamp-2">
                    {test.desc}
                  </p>

                  <div className="mb-4 sm:mb-6 flex items-center gap-4 border-y border-slate-50 py-3 sm:py-4 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Price</span>
                      <div className="flex items-end gap-1 sm:gap-2">
                        <span className="text-lg sm:text-xl font-black text-slate-800">₹{test.price}</span>
                        <span className="mb-0.5 text-[10px] sm:text-xs font-bold text-slate-300 line-through">₹{test.mrp}</span>
                      </div>
                    </div>
                    <div className="ml-auto flex flex-col items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Parameters</span>
                      <span className="text-sm font-black text-[#00a2a4]">{test.parameters} Included</span>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center gap-3">
                    <button 
                      onClick={() => navigate(`/lab-test-details/${test.id}`)}
                      className="flex-1 rounded-xl bg-slate-50 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-[#00a2a4] hover:text-white transition-all"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => navigate(`/lab-test-details/${test.id}`)}
                      className="flex-[1.5] rounded-xl bg-slate-900 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200 hover:bg-[#00a2a4] hover:shadow-teal-100 transition-all"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 6. Why Choose Us Section */}
        <section className="mb-12 sm:mb-20 rounded-2xl sm:rounded-[3rem] bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="text-xl sm:text-2xl font-black uppercase italic tracking-tight text-slate-800">
              Why Choose <span className="text-[#00a2a4]">MediQuick?</span>
            </h2>
            <p className="mt-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Your health is our top priority</p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4">
            {trustPoints.map((point) => (
              <div key={point.title} className="text-center group">
                <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl sm:rounded-3xl bg-teal-50 text-[#00a2a4] group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  {point.icon}
                </div>
                <h4 className="mb-1 text-[10px] sm:text-sm font-black uppercase tracking-widest text-slate-800 leading-tight">{point.title}</h4>
                <p className="hidden sm:block text-[10px] font-bold text-slate-400 uppercase leading-relaxed">{point.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Support Section */}
        <section className="text-center">
          <div className="inline-flex items-center gap-4 rounded-3xl bg-[#00a2a4]/5 px-8 py-6 border border-[#00a2a4]/10">
            <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-[#00a2a4] text-white shadow-lg">
              <PhoneCall size={24} />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">Need Help Booking?</h4>
              <p className="text-[10px] font-bold text-slate-400">Call our health experts at +91 800 123 4567</p>
            </div>
            <ArrowRight className="ml-4 text-[#00a2a4] animate-pulse" />
          </div>
        </section>

      </div>

      <style>{`
        .custom-scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default LabTestsPage;
