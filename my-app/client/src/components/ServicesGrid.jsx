import React from 'react';
import { Link } from 'react-router-dom';

/**
 * @description ServicesGrid Component for MediQuick+
 * Improved for mobile responsiveness and smoother card interaction.
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
    <section className="bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-slate-900">
              Our Quick Services <span className="text-blue-600">+</span>
            </h2>
            <p className="mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Amritsar Hub's Trusted Healthcare Partner
            </p>
          </div>

          <div className="hidden md:block">
            <Link
              to="/all-services"
              className="text-xs font-black text-blue-600 underline decoration-2 underline-offset-4 hover:text-blue-700"
            >
              VIEW ALL SERVICES
            </Link>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.path}
              className="group relative flex flex-col items-center overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 bg-white p-4 sm:p-5 lg:p-6 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(8,112,184,0.08)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative mb-4 text-4xl sm:mb-5 sm:text-5xl transition-transform duration-700 group-hover:scale-125 group-hover:rotate-12">
                {service.img}
              </div>

              <div className="relative z-10 space-y-1">
                <h3 className="text-xs sm:text-sm font-extrabold tracking-tight text-slate-800 transition-colors group-hover:text-blue-600">
                  {service.title}
                </h3>
                <p className={`text-[9px] sm:text-[10px] font-black uppercase italic tracking-wider sm:tracking-widest ${service.color}`}>
                  {service.desc}
                </p>
              </div>

              <div className="mt-3 sm:mt-4 translate-y-2 opacity-100 sm:translate-y-4 sm:opacity-0 transition-all duration-500 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[8px] sm:px-3 sm:text-[9px] font-black uppercase tracking-tight text-white">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View Link */}
        <div className="mt-8 text-center md:hidden">
          <Link to="/all-services" className="text-xs font-black uppercase text-blue-600">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;