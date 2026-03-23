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
    <div className="min-h-screen bg-slate-50/50 px-4 pb-12  sm:pt-24 sm:pb-14">
      <div className="mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="relative mb-10 sm:mb-12 overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] bg-gradient-to-br from-teal-500 to-teal-700 p-6 sm:p-10 md:p-16 text-white shadow-xl shadow-teal-100">
          <div className="absolute top-0 right-0 translate-x-10 sm:translate-x-16 md:translate-x-20 -translate-y-6 sm:-translate-y-8 md:-translate-y-10 text-[7rem] sm:text-[10rem] md:text-[15rem] opacity-10">
            👨‍⚕️
          </div>

          <div className="relative z-10 max-w-2xl">
            <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter leading-none">
              Consult Top <span className="text-teal-200">Doctors Online</span>
            </h1>

            <p className="mb-6 sm:mb-8 max-w-xl text-sm sm:text-base md:text-lg font-bold italic opacity-90">
              Private video & chat consultations with verified specialists within 10 minutes.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button className="rounded-2xl bg-white px-5 sm:px-8 py-3 sm:py-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-widest text-teal-700 shadow-lg transition-transform hover:scale-105">
                Start Consultation Now
              </button>
            </div>
          </div>
        </div>

        {/* Specialists Grid */}
        <h2 className="mb-6 sm:mb-8 px-2 text-xl sm:text-2xl font-black italic uppercase tracking-tighter text-slate-800">
          Pick a <span className="text-teal-600">Speciality</span>
        </h2>

        <div className="mb-14 sm:mb-16 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {specialists.map((doc) => (
            <div
              key={doc.id}
              className="group flex flex-col items-center rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 bg-white p-6 sm:p-8 text-center transition-all duration-500 hover:shadow-2xl"
            >
              <div className="mb-5 sm:mb-6 text-5xl sm:text-6xl transition-transform group-hover:scale-125 group-hover:-rotate-6">
                {doc.img}
              </div>

              <h3 className="mb-2 text-base sm:text-lg font-black uppercase tracking-tight text-slate-800">
                {doc.role}
              </h3>

              <p className="mb-5 sm:mb-6 text-[11px] sm:text-xs font-bold leading-relaxed text-slate-400">
                {doc.desc}
              </p>

              <div className="mt-auto">
                <p className="mb-4 text-[10px] sm:text-xs font-black italic text-teal-600">
                  FEE STARTS @ ₹{doc.fee}
                </p>

                <button className="rounded-xl bg-slate-900 px-5 sm:px-6 py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-widest text-white shadow-lg shadow-slate-100 transition-colors hover:bg-teal-600">
                  Consult Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Section */}
        <div className="flex flex-col items-center justify-around gap-6 sm:gap-8 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 bg-white p-6 sm:p-8 text-center md:flex-row">
          <div>
            <h4 className="text-2xl sm:text-3xl font-black leading-none text-slate-900">100%</h4>
            <p className="mt-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
              Private & Secure
            </p>
          </div>

          <div className="hidden h-12 w-px bg-slate-100 md:block" />

          <div>
            <h4 className="text-2xl sm:text-3xl font-black leading-none text-slate-900">500+</h4>
            <p className="mt-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
              Verified Doctors
            </p>
          </div>

          <div className="hidden h-12 w-px bg-slate-100 md:block" />

          <div>
            <h4 className="text-2xl sm:text-3xl font-black leading-none text-slate-900">24/7</h4>
            <p className="mt-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
              Available Always
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultPage;