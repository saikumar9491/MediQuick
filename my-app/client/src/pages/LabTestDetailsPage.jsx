import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  FlaskConical, 
  Clock, 
  ShieldCheck, 
  Info, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Upload,
  CreditCard
} from 'lucide-react';
import toast from 'react-hot-toast';

const LabTestDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Details, 2: Booking

  // Mock data - in a real app, you'd fetch this based on the ID
  const testDetails = {
    id: id,
    name: id === 'cbc-test' ? 'CBC Test (Complete Blood Count)' : 'Diagnostic Lab Test',
    desc: 'The Complete Blood Count (CBC) is a blood test used to evaluate your overall health and detect a wide range of disorders, including anemia, infection and leukemia.',
    price: 299,
    mrp: 500,
    preparation: 'Fasting not required. Drink plenty of water.',
    reportTime: '24 Hours',
    parameters: [
      'Hemoglobin', 'Packed Cell Volume (PCV)', 'Mean Corpuscular Volume (MCV)', 
      'RBC Count', 'WBC Count', 'Platelet Count', 'Differential Leucocyte Count'
    ],
    covered: 'This test covers 18 essential blood parameters to provide a comprehensive view of your blood health.'
  };

  const handleBooking = (e) => {
    e.preventDefault();
    toast.success('Lab Test Booked Successfully!');
    navigate('/lab-tests');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        <button 
          onClick={() => step === 1 ? navigate('/lab-tests') : setStep(1)}
          className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#00a2a4] transition-colors"
        >
          <ChevronLeft size={16} /> Back to {step === 1 ? 'Tests' : 'Details'}
        </button>

        {step === 1 ? (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Header Card */}
            <div className="rounded-[2.5rem] bg-white p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="h-20 w-20 flex shrink-0 items-center justify-center rounded-3xl bg-teal-50 text-[#00a2a4]">
                  <FlaskConical size={40} />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-black uppercase italic tracking-tight text-slate-800">{testDetails.name}</h1>
                  <p className="mt-2 text-[11px] font-bold text-slate-400 uppercase leading-relaxed">{testDetails.desc}</p>
                  
                  <div className="mt-6 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                      <Clock size={14} /> Report in {testDetails.reportTime}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                      <ShieldCheck size={14} /> Certified Lab
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-slate-50 pt-8">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Payable</span>
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-black text-slate-900">₹{testDetails.price}</span>
                    <span className="mb-1 text-base font-bold text-slate-300 line-through">₹{testDetails.mrp}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setStep(2)}
                  className="rounded-2xl bg-[#00a2a4] px-10 py-5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-teal-100 hover:bg-teal-700 transition-all"
                >
                  Book Now
                </button>
              </div>
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <div className="rounded-[2rem] bg-white p-8 shadow-lg border border-slate-50">
                  <h3 className="mb-6 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-800">
                    <Info size={18} className="text-[#00a2a4]" /> Parameters Covered ({testDetails.parameters.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {testDetails.parameters.map((param, i) => (
                      <div key={i} className="flex items-center gap-3 text-[11px] font-bold text-slate-500 uppercase">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        {param}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] bg-white p-6 shadow-lg border border-slate-50">
                  <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-800">Preparation</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
                    {testDetails.preparation}
                  </p>
                </div>

                <div className="rounded-[2rem] bg-slate-900 p-6 text-white shadow-xl">
                  <h3 className="mb-4 text-xs font-black uppercase tracking-widest">Why MediQuick?</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <ShieldCheck size={16} className="text-teal-400 shrink-0" />
                      <span className="text-[10px] font-bold uppercase">NABL Accredited Partners</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Clock size={16} className="text-teal-400 shrink-0" />
                      <span className="text-[10px] font-bold uppercase">On-time Sample Pickup</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[2.5rem] bg-white p-8 shadow-2xl border border-slate-100"
          >
            <h2 className="mb-8 text-2xl font-black uppercase italic tracking-tight text-slate-800">
              Complete Your <span className="text-[#00a2a4]">Booking</span>
            </h2>

            <form onSubmit={handleBooking} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="date" required className="w-full rounded-xl border border-slate-100 bg-slate-50 py-4 pl-12 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-[#00a2a4]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Collection Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="House no, Street, Landmark" required className="w-full rounded-xl border border-slate-100 bg-slate-50 py-4 pl-12 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-[#00a2a4]" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-slate-100 p-6 text-center">
                <Upload className="mx-auto mb-2 text-slate-300" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Prescription (Optional)</p>
                <input type="file" className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="mt-4 inline-block cursor-pointer rounded-lg bg-slate-50 px-6 py-2 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-[#00a2a4] hover:text-white transition-all">
                  Choose File
                </label>
              </div>

              <div className="rounded-2xl bg-teal-50 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-[#00a2a4]" size={20} />
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-800">Total Amount</h4>
                      <p className="text-lg font-black text-[#00a2a4]">₹{testDetails.price}</p>
                    </div>
                  </div>
                  <button type="submit" className="rounded-xl bg-[#00a2a4] px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl hover:bg-teal-700 transition-all">
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default LabTestDetailsPage;
