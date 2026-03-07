import React from 'react';
import { Link } from 'react-router-dom';

/**
 * @description ServicesGrid Component for MediQuick+
 * Unique Features: Modern Glassmorphism, Floating Icons, and Dynamic Hover states.
 */
const ServicesGrid = () => {
  const services = [
    { title: "Medicines", img: "💊", desc: "Flat 25% Off", color: "text-orange-600", path: "/medicines" },
    { title: "Lab Tests", img: "🔬", desc: "Up to 70% Off", color: "text-lab-tests", path: "/lab-tests" },
    { title: "Consult Doctor", img: "👨‍⚕️", desc: "Online Chat", color: "text-teal-600", path: "/consult" },
    { title: "Ayurveda", img: "🌿", desc: "Pure Herbal", color: "text-green-600", path: "/ayurveda" },
    { title: "Care Plan", img: "💳", desc: "Extra Savings", color: "text-red-600", path: "/care-plan" },
    { title: "Skin Care", img: "✨", desc: "Dermatologist Approved", color: "text-pink-600", path: "/skin-care" },
  ];

  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
              Our Quick Services <span className="text-blue-600">+</span>
            </h2>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-[0.2em]">
              Amritsar Hub's Trusted Healthcare Partner
            </p>
          </div>
          <div className="hidden md:block">
            <Link to="/all-services" className="text-xs font-black text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-4">
              VIEW ALL SERVICES
            </Link>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.path}
              className="group relative bg-white rounded-[2rem] border border-slate-100 p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(8,112,184,0.08)] flex flex-col items-center text-center overflow-hidden"
            >
              {/* Subtle Background Glow on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Icon with Floating Animation */}
              <div className="relative text-5xl mb-5 transform transition-transform duration-700 group-hover:scale-125 group-hover:rotate-12">
                {service.img}
              </div>

              {/* Content */}
              <div className="relative z-10 space-y-1">
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className={`text-[10px] font-black uppercase italic tracking-widest ${service.color}`}>
                  {service.desc}
                </p>
              </div>

              {/* Hidden Action Prompt */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <span className="text-[9px] font-black text-white bg-slate-900 px-3 py-1 rounded-full uppercase tracking-tighter">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View Link */}
        <div className="mt-8 md:hidden text-center">
          <Link to="/all-services" className="text-xs font-black text-blue-600 uppercase">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;