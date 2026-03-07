import React from 'react';

/**
 * @description Consult Doctor Page
 * Features: Specialist categories, "How it Works" section, and premium action buttons.
 */
const ConsultPage = () => {
  const specialists = [
    { id: 1, role: "General Physician", img: "👨‍⚕️", fee: 299, desc: "Fever, Cold, Cough & Infections" },
    { id: 2, role: "Dermatologist", img: "👩‍⚕️", fee: 499, desc: "Skin, Hair & Nail concerns" },
    { id: 3, role: "Pediatrician", img: "👶", fee: 399, desc: "Child health and vaccinations" },
    { id: 4, role: "Dietitian", img: "🥗", fee: 199, desc: "Weight loss & Nutrition plans" }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-[3rem] p-10 md:p-16 text-white mb-12 shadow-xl shadow-teal-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 text-[15rem] translate-x-20 -translate-y-10">👨‍⚕️</div>
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-4">
              Consult Top <span className="text-teal-200">Doctors Online</span>
            </h1>
            <p className="text-lg font-bold italic opacity-90 mb-8">
              Private video & chat consultations with verified specialists within 10 minutes.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-teal-700 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-transform">
                Start Consultation Now
              </button>
            </div>
          </div>
        </div>

        {/* Specialists Grid */}
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-800 mb-8 px-2">
          Pick a <span className="text-teal-600">Speciality</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {specialists.map((doc) => (
            <div key={doc.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl transition-all duration-500 group text-center flex flex-col items-center">
              <div className="text-6xl mb-6 transform transition-transform group-hover:scale-125 group-hover:-rotate-6">
                {doc.img}
              </div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">
                {doc.role}
              </h3>
              <p className="text-xs font-bold text-slate-400 mb-6 leading-relaxed">
                {doc.desc}
              </p>
              <div className="mt-auto">
                <p className="text-xs font-black text-teal-600 mb-4 italic">FEE STARTS @ ₹{doc.fee}</p>
                <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-600 transition-colors shadow-lg shadow-slate-100">
                  Consult Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Section */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 flex flex-col md:flex-row justify-around items-center gap-8 text-center">
          <div>
            <h4 className="text-3xl font-black text-slate-900 leading-none">100%</h4>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Private & Secure</p>
          </div>
          <div className="h-12 w-px bg-slate-100 hidden md:block" />
          <div>
            <h4 className="text-3xl font-black text-slate-900 leading-none">500+</h4>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Verified Doctors</p>
          </div>
          <div className="h-12 w-px bg-slate-100 hidden md:block" />
          <div>
            <h4 className="text-3xl font-black text-slate-900 leading-none">24/7</h4>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Available Always</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ConsultPage;