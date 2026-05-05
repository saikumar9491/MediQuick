import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  User, 
  Star, 
  Clock, 
  MapPin, 
  Stethoscope, 
  Video, 
  MessageSquare, 
  Phone, 
  ChevronRight,
  Filter,
  ShieldCheck,
  Award,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ConsultPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { name: 'All', icon: <Stethoscope size={18} /> },
    { name: 'General Physician', icon: <User size={18} /> },
    { name: 'Dermatologist', icon: <Award size={18} /> },
    { name: 'Pediatrician', icon: <ShieldCheck size={18} /> },
    { name: 'Gynecologist', icon: <User size={18} /> },
    { name: 'Cardiologist', icon: <Award size={18} /> }
  ];

  const doctors = [
    {
      id: 'dr-sharma',
      name: 'Dr. Amit Sharma',
      specialty: 'General Physician',
      rating: 4.8,
      reviews: 120,
      fee: 499,
      experience: '12 Years',
      time: '10:00 AM - 04:00 PM',
      image: 'https://i.pinimg.com/736x/29/d5/ce/29d5ce8189c51040fc2441eb6ed092d5.jpg',
      languages: ['English', 'Hindi']
    },
    {
      id: 'dr-verma',
      name: 'Dr. Priya Verma',
      specialty: 'Dermatologist',
      rating: 4.9,
      reviews: 250,
      fee: 699,
      experience: '8 Years',
      time: '11:30 AM - 06:00 PM',
      image: 'https://i.pinimg.com/736x/29/d5/ce/29d5ce8189c51040fc2441eb6ed092d5.jpg',
      languages: ['English', 'Hindi', 'Punjabi']
    },
    {
      id: 'dr-gupta',
      name: 'Dr. Rajesh Gupta',
      specialty: 'Cardiologist',
      rating: 4.7,
      reviews: 95,
      fee: 999,
      experience: '15 Years',
      time: '09:00 AM - 01:00 PM',
      image: 'https://i.pinimg.com/736x/29/d5/ce/29d5ce8189c51040fc2441eb6ed092d5.jpg',
      languages: ['English', 'Hindi']
    },
    {
      id: 'dr-reddy',
      name: 'Dr. S. Reddy',
      specialty: 'Pediatrician',
      rating: 4.8,
      reviews: 180,
      fee: 599,
      experience: '10 Years',
      time: '04:00 PM - 08:00 PM',
      image: 'https://i.pinimg.com/736x/29/d5/ce/29d5ce8189c51040fc2441eb6ed092d5.jpg',
      languages: ['English', 'Hindi', 'Telugu']
    }
  ];

  const filteredDoctors = doctors.filter(doc => {
    const matchesCategory = activeCategory === 'All' || doc.specialty === activeCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const banners = [
    {
      title: "Talk to Specialists in 10 Mins",
      desc: "Connect with certified doctors via video or audio call.",
      bg: "from-[#00a2a4] to-teal-800",
      tag: "INSTANT CONSULT",
      icon: "🩺"
    },
    {
      title: "Mental Wellness Matters",
      desc: "Expert counseling and therapy sessions starting ₹499.",
      bg: "from-blue-600 to-indigo-800",
      tag: "MENTAL HEALTH",
      icon: "🧠"
    }
  ];

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 1. Header Section */}
        <section className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black uppercase italic tracking-tight text-slate-800 sm:text-5xl"
          >
            Consult <span className="text-[#00a2a4]">Doctors Online</span>
          </motion.h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-bold uppercase tracking-widest text-slate-400">
            Get expert advice from certified doctors from the comfort of your home.
          </p>
        </section>

        {/* Professional Banner */}
        <section className="mb-10 overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl border border-slate-100">
          <div className="relative h-[160px] sm:h-[220px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`absolute inset-0 bg-gradient-to-br ${banners[currentBanner].bg} p-8 sm:p-12`}
              >
                <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[8rem] opacity-10 select-none">
                  {banners[currentBanner].icon}
                </div>
                
                <div className="relative z-10 flex h-full flex-col justify-center">
                  <span className="mb-3 w-fit rounded-full bg-white/20 px-3 py-0.5 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md border border-white/10">
                    {banners[currentBanner].tag} SPECIAL
                  </span>
                  <h2 className="max-w-xl text-xl font-black italic tracking-tighter text-white sm:text-3xl uppercase">
                    {banners[currentBanner].title}
                  </h2>
                  <p className="mt-2 max-w-md text-[10px] font-bold text-white/80 sm:text-sm uppercase tracking-widest">
                    {banners[currentBanner].desc}
                  </p>
                  <button className="mt-6 w-fit rounded-xl bg-white px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl hover:bg-[#00a2a4] hover:text-white transition-all">
                    Consult Now
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentBanner(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    currentBanner === i ? 'w-8 bg-white' : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 2. Doctor Categories (Filter Section) */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Filter size={18} className="text-[#00a2a4]" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Choose Specialty</h3>
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

        {/* 3. Doctor Listing Section */}
        <section className="mb-20">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-black uppercase italic tracking-tight text-slate-800">
              Expert <span className="text-[#00a2a4]">Medical Specialists</span>
            </h2>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {filteredDoctors.length} Doctors Available Now
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doc) => (
              <motion.div
                layout
                key={doc.id}
                className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border-2 border-slate-50 bg-white shadow-sm transition-all hover:border-[#00a2a4] hover:shadow-2xl hover:shadow-teal-100"
              >
                {/* Doctor Image & Quick Info */}
                <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                  <img 
                    src={doc.image} 
                    alt={doc.name} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-md">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-black text-slate-800">{doc.rating} ({doc.reviews})</span>
                    </div>
                    <div className="rounded-full bg-[#00a2a4] px-3 py-1.5 text-[10px] font-black text-white">
                      {doc.experience} Exp.
                    </div>
                  </div>
                </div>

                <div className="flex flex-col p-8 flex-1">
                  <div className="mb-6 flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#00a2a4]">{doc.specialty}</span>
                    <h3 className="mt-1 text-2xl font-black uppercase italic tracking-tight text-slate-800 group-hover:text-[#00a2a4] transition-colors">
                      {doc.name}
                    </h3>
                  </div>

                  <div className="mb-8 space-y-3 border-y border-slate-50 py-6">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Consultation Fee</span>
                      <span className="text-sm text-slate-800 font-black">₹{doc.fee}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Available Time</span>
                      <span className="text-sm text-emerald-600 font-black flex items-center gap-1">
                        <Clock size={14} /> {doc.time}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center gap-3">
                    <button 
                      onClick={() => navigate(`/doctor-details/${doc.id}`)}
                      className="flex-1 rounded-2xl bg-slate-50 py-4 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-[#00a2a4] hover:text-white transition-all"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => navigate(`/doctor-details/${doc.id}?book=true`)}
                      className="flex-[1.5] rounded-2xl bg-slate-900 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200 hover:bg-[#00a2a4] hover:shadow-teal-100 transition-all"
                    >
                      Consult Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why Consult Online? */}
        <section className="mb-20 rounded-[3rem] bg-slate-900 p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#00a2a4]/20 to-transparent" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
            <div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter sm:text-5xl">
                Ready to talk to a <span className="text-[#00a2a4]">Specialist?</span>
              </h2>
              <p className="mt-6 text-sm font-bold text-slate-400 uppercase leading-relaxed tracking-widest">
                Our doctors are available 24/7. Connect within 10 minutes for an online consultation.
              </p>
              <div className="mt-10 flex flex-wrap gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-[#00a2a4]/20 text-[#00a2a4]">
                    <Video size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Video Call</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-[#00a2a4]/20 text-[#00a2a4]">
                    <Phone size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Audio Call</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-[#00a2a4]/20 text-[#00a2a4]">
                    <MessageSquare size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Chat Support</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-white/5 p-6 backdrop-blur-md border border-white/10">
                <ShieldCheck className="mb-3 text-[#00a2a4]" size={32} />
                <h4 className="text-[10px] font-black uppercase tracking-widest">Secure & Private</h4>
                <p className="mt-2 text-[9px] font-bold text-slate-500 uppercase">100% encrypted consultations</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-6 backdrop-blur-md border border-white/10 mt-8">
                <Award className="mb-3 text-[#00a2a4]" size={32} />
                <h4 className="text-[10px] font-black uppercase tracking-widest">Verified Doctors</h4>
                <p className="mt-2 text-[9px] font-bold text-slate-500 uppercase">Certified medical professionals</p>
              </div>
            </div>
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

export default ConsultPage;