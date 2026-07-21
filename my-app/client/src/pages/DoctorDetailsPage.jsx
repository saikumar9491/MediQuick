import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Star, 
  Award, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Video, 
  MessageSquare, 
  Phone, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles,
  CreditCard,
  Building,
  Loader2,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDoctorDetails, createDoctorAppointment } from '../api/doctors';
import { createRazorpayOrder, verifyRazorpayPayment } from '../api/checkout';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

const DoctorDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Scheduler state
  const [selectedMode, setSelectedMode] = useState('video');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  
  // Patient details
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Male');
  const [symptomNotes, setSymptomNotes] = useState('');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('Online');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [successAppointment, setSuccessAppointment] = useState(null);

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);
      try {
        const data = await getDoctorDetails(id);
        setDoctor(data);
        if (data.consultationModes && data.consultationModes.length > 0) {
          setSelectedMode(data.consultationModes[0]);
        }
      } catch (err) {
        console.error('Failed to load doctor profile:', err);
        toast.error('Doctor profile not found');
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  useEffect(() => {
    if (user) {
      if (!patientName) setPatientName(user.name || '');
    }
  }, [user]);

  useEffect(() => {
    if (successAppointment) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#00a2a4', '#10b981', '#f59e0b', '#3b82f6']
      });
    }
  }, [successAppointment]);

  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        fullDate: d.toISOString().split('T')[0],
        dayName: i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }),
        dateNum: d.getDate(),
        monthName: d.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    return dates;
  }, []);

  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0].fullDate);
    }
  }, [availableDates, selectedDate]);

  const timeSlots = [
    '09:30 AM - 10:00 AM',
    '10:30 AM - 11:00 AM',
    '11:30 AM - 12:00 PM',
    '02:00 PM - 02:30 PM',
    '03:30 PM - 04:00 PM',
    '05:00 PM - 05:30 PM'
  ];

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to book a consultation');
      return navigate('/login', { state: { from: `/consult-doctor/${id}` } });
    }

    if (!selectedDate) return toast.error('Please select a consultation date');
    if (!selectedSlot) return toast.error('Please select a preferred time slot');
    if (!patientName.trim()) return toast.error('Please enter patient name');
    if (!patientAge) return toast.error('Please enter patient age');

    setBookingLoading(true);
    try {
      const fee = doctor.consultationFee;

      if (paymentMethod === 'Online') {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          setBookingLoading(false);
          return toast.error('Razorpay SDK failed to load. Are you online?');
        }

        const rzpOrder = await createRazorpayOrder(token, fee);

        const options = {
          key: rzpOrder.keyId,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency || 'INR',
          name: 'MediQuick Telemedicine',
          description: `Consultation with ${doctor.name}`,
          order_id: rzpOrder.razorpayOrderId,
          handler: async (response) => {
            try {
              await verifyRazorpayPayment(token, response);
              const appointmentData = {
                doctorId: id,
                patientName,
                patientAge: Number(patientAge),
                patientGender,
                scheduledDate: selectedDate,
                scheduledTimeSlot: selectedSlot,
                mode: selectedMode,
                symptomNotes,
                paymentMethod: 'Online',
                paymentStatus: 'Paid'
              };
              const result = await createDoctorAppointment(token, appointmentData);
              setSuccessAppointment(result);
              toast.success('Doctor consultation booked & paid successfully!');
            } catch (err) {
              toast.error(err.message || 'Payment verification failed');
            } finally {
              setBookingLoading(false);
            }
          },
          prefill: {
            name: patientName,
            email: user?.email || '',
            contact: user?.phone || ''
          },
          theme: { color: '#00a2a4' },
          modal: {
            ondismiss: () => {
              setBookingLoading(false);
              toast.error('Payment cancelled');
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      }

      // Cash on Consultation flow
      const appointmentData = {
        doctorId: id,
        patientName,
        patientAge: Number(patientAge),
        patientGender,
        scheduledDate: selectedDate,
        scheduledTimeSlot: selectedSlot,
        mode: selectedMode,
        symptomNotes,
        paymentMethod: 'COD',
        paymentStatus: 'Pending'
      };

      const result = await createDoctorAppointment(token, appointmentData);
      setSuccessAppointment(result);
      toast.success('Doctor consultation booked successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to submit appointment');
    } finally {
      if (paymentMethod !== 'Online') {
        setBookingLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBFD] flex items-center justify-center pt-20">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-48 bg-slate-100 rounded" />
          <div className="h-4 w-32 bg-slate-100 rounded" />
        </div>
      </div>
    );
  }

  if (successAppointment) {
    return (
      <div className="min-h-[calc(100vh-100px)] bg-[#FAFBFD] pt-20 pb-12 flex flex-col items-center justify-center px-4 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1.2 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute w-96 h-96 bg-[#00a2a4]/10 rounded-full blur-3xl -z-10 pointer-events-none" 
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="max-w-md w-full bg-white border border-slate-200/60 rounded-[32px] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.06)] text-center relative"
        >
          <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.15, duration: 0.5, ease: "backOut" }}
              className="absolute inset-0 rounded-full bg-emerald-50 border-2 border-emerald-100"
            />
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 15 }}
              className="relative text-emerald-500"
            >
              <CheckCircle size={42} strokeWidth={2.2} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="absolute -top-1 -right-1 text-amber-400"
            >
              <Sparkles size={16} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#00a2a4] bg-[#00a2a4]/10 px-3 py-1 rounded-full inline-block mb-3">
              Consultation Scheduled
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug mb-1.5" style={{ letterSpacing: '-0.02em' }}>
              Appointment Confirmed!
            </h2>
            <p className="text-xs text-slate-400 font-semibold mb-6">
              Ref ID: <span className="font-mono text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded">{successAppointment._id}</span>
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-slate-50/80 backdrop-blur-xs rounded-2xl p-4 text-left space-y-3 mb-8 border border-slate-100/80 shadow-inner"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">Doctor</span>
              <span className="text-slate-800 font-bold">{doctor?.name}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">Patient Name</span>
              <span className="text-slate-800 font-bold">{successAppointment.patientName}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">Scheduled Date</span>
              <span className="text-slate-800 font-bold">{successAppointment.scheduledDate}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">Time Slot</span>
              <span className="text-slate-800 font-bold">{successAppointment.scheduledTimeSlot}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">Mode</span>
              <span className="text-[#00a2a4] font-bold capitalize">{successAppointment.mode} Consultation</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">Payment Status</span>
              <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${successAppointment.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {successAppointment.paymentStatus}
              </span>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            onClick={() => navigate('/profile?tab=appointments')}
            className="w-full py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition-all cursor-pointer shadow-lg shadow-slate-900/10 active:scale-98"
          >
            View My Appointments
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFD] pb-24 pt-4 sm:pt-6">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Back link */}
        <button 
          onClick={() => navigate('/consult')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-850 mb-6 transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} /> Back to Doctors
        </button>

        {/* Doctor Summary Header Card */}
        <div className="bg-white border border-slate-200/60 rounded-[32px] p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.03)] mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img 
            src={doctor.photo || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80"} 
            alt={doctor.name}
            className="w-28 h-28 rounded-2xl object-cover border border-slate-100 shadow-xs flex-shrink-0 bg-slate-50"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-3 py-1 rounded-full bg-[#00a2a4]/10 text-[#00a2a4] text-[10px] font-black uppercase tracking-wider">
                {doctor.specialization}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                {doctor.rating} ({doctor.numReviews} Reviews)
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{doctor.name}</h1>
            <p className="text-xs font-semibold text-slate-500 mb-2">{doctor.qualifications}</p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1 text-slate-600">
                <Award size={14} className="text-[#00a2a4]" />
                {doctor.experienceYears} Years Experience
              </span>
              <span>•</span>
              <span>Reg: <span className="font-mono text-slate-800 font-bold">{doctor.registrationNumber || 'Verified'}</span></span>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleBookingSubmit} className="space-y-8">
          
          {/* STEP 1: Consultation Mode */}
          <div className="bg-white border border-slate-200/60 rounded-[32px] p-6 sm:p-8 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-1">1. Select Consultation Mode</h3>
            <p className="text-xs text-slate-400 font-medium mb-4">Choose your preferred mode of communication with the doctor</p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'video', label: 'HD Video Call', icon: Video },
                { id: 'audio', label: 'Voice Audio Call', icon: Phone },
                { id: 'chat', label: 'Text Chat Session', icon: MessageSquare }
              ].map(m => {
                const Icon = m.icon;
                const isSelected = selectedMode === m.id;
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setSelectedMode(m.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer text-center ${
                      isSelected
                        ? 'bg-[#00a2a4]/10 border-[#00a2a4] text-[#00a2a4] font-bold shadow-xs'
                        : 'bg-slate-50/50 border-slate-200/60 text-slate-600 hover:bg-slate-100/50'
                    }`}
                  >
                    <Icon size={20} className="mb-2" />
                    <span className="text-xs font-bold leading-tight">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Date & Time Slot Selection */}
          <div className="bg-white border border-slate-200/60 rounded-[32px] p-6 sm:p-8 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-1">2. Select Consultation Date & Time</h3>
            <p className="text-xs text-slate-400 font-medium mb-4">Choose a date and available slot</p>

            {/* Date Pills */}
            <div className="flex gap-2.5 overflow-x-auto pb-4 custom-scrollbar mb-6">
              {availableDates.map(d => {
                const isSelected = selectedDate === d.fullDate;
                return (
                  <button
                    type="button"
                    key={d.fullDate}
                    onClick={() => setSelectedDate(d.fullDate)}
                    className={`flex flex-col items-center min-w-[76px] px-3 py-3 rounded-2xl border transition-all cursor-pointer flex-shrink-0 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-slate-50 border-slate-200/70 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{d.dayName}</span>
                    <span className="text-base font-bold my-0.5">{d.dateNum}</span>
                    <span className="text-[9px] font-semibold opacity-70">{d.monthName}</span>
                  </button>
                );
              })}
            </div>

            {/* Time Slot Grid */}
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Available Time Slots</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {timeSlots.map(slot => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#00a2a4] text-white border-[#00a2a4] shadow-xs'
                        : 'bg-white border-slate-200/80 text-slate-700 hover:border-[#00a2a4]/40 hover:bg-slate-50'
                    }`}
                  >
                    <Clock size={13} />
                    <span>{slot}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Patient Information */}
          <div className="bg-white border border-slate-200/60 rounded-[32px] p-6 sm:p-8 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-1">3. Patient Details</h3>
            <p className="text-xs text-slate-400 font-medium mb-6">Enter patient details for doctor review</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Patient Full Name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00a2a4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Age</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    placeholder="Age"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00a2a4]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Gender</label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00a2a4]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Symptoms / Reason for Consultation (Optional)</label>
              <textarea
                rows="3"
                placeholder="Describe symptoms, duration, or any current medications..."
                value={symptomNotes}
                onChange={(e) => setSymptomNotes(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00a2a4]"
              />
            </div>
          </div>

          {/* STEP 4: Payment Method & Confirmation */}
          <div className="bg-white border border-slate-200/60 rounded-[32px] p-6 sm:p-8 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-4">4. Payment Method</h3>

            <div className="space-y-3 mb-6">
              <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === 'Online' ? 'bg-[#00a2a4]/5 border-[#00a2a4]' : 'bg-slate-50/50 border-slate-200/60'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Online'}
                    onChange={() => setPaymentMethod('Online')}
                    className="w-4 h-4 text-[#00a2a4]"
                  />
                  <CreditCard size={18} className="text-[#00a2a4]" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Pay Online via Razorpay</span>
                    <span className="text-[10px] text-slate-400">UPI, Cards, Net Banking</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  Instant Confirmation
                </span>
              </label>

              <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === 'COD' ? 'bg-[#00a2a4]/5 border-[#00a2a4]' : 'bg-slate-50/50 border-slate-200/60'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="w-4 h-4 text-[#00a2a4]"
                  />
                  <Building size={18} className="text-slate-600" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Pay at Consultation</span>
                    <span className="text-[10px] text-slate-400">Pay fee during consultation session</span>
                  </div>
                </div>
              </label>
            </div>

            {/* Price breakdown summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-slate-600">Total Consultation Fee</span>
              <span className="text-xl font-bold text-slate-900">₹{doctor.consultationFee}</span>
            </div>

            <button
              type="submit"
              disabled={bookingLoading}
              className="w-full py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer shadow-lg shadow-slate-900/10 active:scale-98 flex items-center justify-center gap-2"
            >
              {bookingLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing Appointment...</span>
                </>
              ) : (
                <span>Confirm & Book Appointment</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default DoctorDetailsPage;
