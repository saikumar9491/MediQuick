import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Star, 
  Clock, 
  ShieldCheck, 
  Award, 
  MessageSquare,
  Languages,
  BookOpen,
  Calendar,
  CheckCircle2,
  Upload,
  CreditCard,
  Phone
} from 'lucide-react';
import toast from 'react-hot-toast';

const DoctorDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(searchParams.get('book') === 'true' ? 2 : 1); // 1: Profile, 2: Booking

  // Mock data - in a real app, you'd fetch this based on the ID
  const doctor = {
    id: id,
    name: 'Dr. Amit Sharma',
    specialty: 'General Physician',
    rating: 4.8,
    reviews: 120,
    fee: 499,
    experience: '12 Years',
    qualification: 'MBBS, MD (Internal Medicine)',
    languages: ['English', 'Hindi', 'Punjabi'],
    image: 'https://i.pinimg.com/736x/29/d5/ce/29d5ce8189c51040fc2441eb6ed092d5.jpg',
    about: 'Dr. Amit Sharma is a highly experienced General Physician with over 12 years of practice. He specializes in chronic disease management, preventive care, and infectious diseases. He is known for his patient-centric approach and thorough diagnostic skills.',
    slots: ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM', '06:00 PM']
  };

  const handleBooking = (e) => {
    e.preventDefault();
    toast.success('Appointment Booked Successfully!');
    navigate('/consult');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        
        <button 
          onClick={() => step === 1 ? navigate('/consult') : setStep(1)}
          className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#00a2a4] transition-colors"
        >
          <ChevronLeft size={16} /> Back to {step === 1 ? 'Doctors' : 'Profile'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Doctor Info Card */}
          <div className="lg:col-span-2 space-y-8">
            {step === 1 ? (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                {/* Profile Card */}
                <div className="rounded-[3rem] bg-white p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                  <div className="flex flex-col md:flex-row gap-10 items-start">
                    <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-[2.5rem] bg-slate-100 shadow-2xl">
                      <img src={doctor.image} alt={doctor.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#00a2a4]">{doctor.specialty}</span>
                        <h1 className="mt-2 text-4xl font-black uppercase italic tracking-tight text-slate-800">{doctor.name}</h1>
                        <p className="mt-1 text-sm font-bold text-slate-400 uppercase">{doctor.qualification}</p>
                      </div>

                      <div className="mt-8 flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-2">
                          <Star size={16} className="fill-amber-400 text-amber-400" />
                          <span className="text-[11px] font-black text-slate-800">{doctor.rating} Rating ({doctor.reviews} Reviews)</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-2xl bg-teal-50 px-4 py-2">
                          <Award size={16} className="text-[#00a2a4]" />
                          <span className="text-[11px] font-black text-slate-800">{doctor.experience} Experience</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        <Languages size={20} />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Languages</h4>
                        <p className="text-xs font-black text-slate-800 uppercase">{doctor.languages.join(', ')}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <BookOpen size={16} className="text-[#00a2a4]" /> About the Doctor
                      </h4>
                      <p className="text-[11px] font-bold text-slate-500 uppercase leading-relaxed">
                        {doctor.about}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-[3rem] bg-white p-10 shadow-2xl border border-slate-100"
              >
                <h2 className="mb-10 text-3xl font-black uppercase italic tracking-tight text-slate-800">
                  Book Your <span className="text-[#00a2a4]">Appointment</span>
                </h2>

                <form onSubmit={handleBooking} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Appointment Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input type="date" required className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-5 pl-14 pr-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#00a2a4]" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Time Slot</label>
                      <div className="grid grid-cols-3 gap-2">
                        {doctor.slots.map(slot => (
                          <button key={slot} type="button" className="rounded-xl border border-slate-100 bg-white py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-[#00a2a4] hover:text-white transition-all">
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Patient Details</label>
                      <input type="text" placeholder="Patient Full Name" required className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-5 px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-[#00a2a4]" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Describe the Problem</label>
                      <textarea rows="4" placeholder="Briefly describe symptoms or health concerns..." required className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-5 px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-[#00a2a4] resize-none"></textarea>
                    </div>
                  </div>

                  <div className="rounded-[2rem] border-2 border-dashed border-slate-100 p-10 text-center">
                    <Upload className="mx-auto mb-4 text-slate-300" size={40} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Medical Reports (Optional)</p>
                    <input type="file" className="hidden" id="report-upload" />
                    <label htmlFor="report-upload" className="mt-6 inline-block cursor-pointer rounded-2xl bg-slate-900 px-10 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#00a2a4] transition-all">
                      Browse Files
                    </label>
                  </div>
                </form>
              </motion.div>
            )}
          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:col-start-3">
            <div className="sticky top-32 space-y-6">
              {/* Fee Card */}
              <div className="rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Consultation Fee</h3>
                <div className="mt-4 flex items-end gap-3">
                  <span className="text-4xl font-black">₹{doctor.fee}</span>
                  <span className="mb-1 text-xs font-bold text-slate-500 uppercase">per session</span>
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-[#00a2a4]" />
                    <span className="text-[10px] font-bold uppercase">Video & Audio Consult</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-[#00a2a4]" />
                    <span className="text-[10px] font-bold uppercase">Free Follow-up (3 Days)</span>
                  </div>
                </div>

                {step === 1 ? (
                  <button 
                    onClick={() => setStep(2)}
                    className="mt-10 w-full rounded-2xl bg-[#00a2a4] py-5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-teal-900/20 hover:bg-teal-700 transition-all"
                  >
                    Consult Now
                  </button>
                ) : (
                  <button 
                    onClick={handleBooking}
                    className="mt-10 w-full rounded-2xl bg-[#00a2a4] py-5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-teal-900/20 hover:bg-teal-700 transition-all"
                  >
                    Pay & Confirm
                  </button>
                )}
              </div>

              {/* Trust Card */}
              <div className="rounded-[2.5rem] bg-white p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <ShieldCheck className="text-[#00a2a4]" size={24} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-800">MediQuick Trust</h4>
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">
                  We ensure 100% privacy and secure consultations with verified medical professionals.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DoctorDetailsPage;
