import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, CreditCard, ChevronLeft, CheckCircle2 } from 'lucide-react';

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  const slots = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM'];

  const handleBooking = () => {
    setStep(3);
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  return (
    <div className="pt-24 pb-20 px-6 bg-slate-50 min-h-screen">
      <div className="container mx-auto max-w-4xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-8 font-semibold transition-colors">
          <ChevronLeft size={20} /> Back to details
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Booking Flow */}
          <div className="lg:col-span-2 space-y-8">
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-8">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Calendar className="text-primary-600" /> Select Date & Time
                </h2>
                
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">Choose a Date</label>
                  <input 
                    type="date" 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">Available Slots</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {slots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-xl font-semibold border-2 transition-all ${
                          selectedSlot === slot 
                            ? 'bg-primary-50 border-primary-600 text-primary-700' 
                            : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  disabled={!selectedDate || !selectedSlot}
                  onClick={() => setStep(2)}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-8">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <CreditCard className="text-primary-600" /> Secure Payment
                </h2>
                
                <div className="space-y-6">
                  <div className="p-4 bg-primary-50 border border-primary-100 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-sm text-primary-700 font-medium">Selected Slot</p>
                      <p className="font-bold text-primary-900">{selectedDate} at {selectedSlot}</p>
                    </div>
                    <button onClick={() => setStep(1)} className="text-sm font-bold text-primary-600 hover:underline">Change</button>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">Card Information</label>
                    <input type="text" placeholder="Card Number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="MM/YY" className="p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                      <input type="text" placeholder="CVC" className="p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                    </div>
                  </div>
                </div>

                <button onClick={handleBooking} className="w-full btn-primary">
                  Pay Now & Confirm Booking
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 rounded-3xl border border-slate-100 shadow-xl text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Booking Confirmed!</h2>
                <p className="text-slate-500">Your appointment has been successfully scheduled. You'll receive a confirmation email shortly.</p>
                <div className="animate-pulse text-primary-600 font-semibold pt-4">Redirecting to your dashboard...</div>
              </motion.div>
            )}
          </div>

          {/* Sidebar / Summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg space-y-4">
              <h3 className="font-bold text-lg">Booking Summary</h3>
              <div className="flex gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=200" 
                  className="w-16 h-16 rounded-xl object-cover" 
                  alt="Service"
                />
                <div>
                  <h4 className="font-bold text-slate-900">Home Cleaning</h4>
                  <p className="text-xs text-slate-500">Professional Service</p>
                </div>
              </div>
              <hr className="border-slate-100" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Service Price</span>
                  <span className="font-bold text-slate-900">$49.99</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Booking Fee</span>
                  <span className="font-bold text-slate-900">$2.00</span>
                </div>
                <hr className="border-slate-100" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">$51.99</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl text-white space-y-4">
              <h3 className="font-bold">Need Help?</h3>
              <p className="text-sm text-slate-400">Our 24/7 support team is here to assist you with your booking.</p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all">
                Chat With Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
