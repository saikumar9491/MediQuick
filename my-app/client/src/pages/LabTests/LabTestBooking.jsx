import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle,
  CreditCard,
  Building,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getLabTestDetails, createLabTestBooking } from '../../api/labTests';
import { createRazorpayOrder, verifyRazorpayPayment } from '../../api/checkout';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

const LabTestBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);

  // Scheduled Slot State
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  // Patient Info State
  const [patientName, setPatientName] = useState(user?.name || '');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Male');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '');

  // Address Selection State
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phoneNumber: user?.phone || '',
    streetAddress: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');

  const timeSlots = [
    "06:00 AM - 08:00 AM",
    "08:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 02:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM"
  ];

  useEffect(() => {
    if (!user) {
      toast.error('Please login to book a lab test');
      return navigate('/login');
    }

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await getLabTestDetails(id);
        setTest(data);
      } catch (err) {
        console.error('Failed to load test details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, user]);

  useEffect(() => {
    if (successBooking) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#00a2a4', '#10b981', '#f59e0b', '#3b82f6']
      });
    }
  }, [successBooking]);

  // Generate next 7 days list for the collection date select
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      const yyyy = nextDate.getFullYear();
      const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
      const dd = String(nextDate.getDate()).padStart(2, '0');
      
      const formattedDate = `${yyyy}-${mm}-${dd}`;
      const displayString = nextDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      dates.push({ value: formattedDate, label: displayString });
    }
    return dates;
  }, []);

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

    if (!selectedDate) return toast.error('Please select a collection date');
    if (!selectedSlot) return toast.error('Please select a preferred time slot');
    if (!patientName.trim()) return toast.error('Please enter patient name');
    if (!patientAge) return toast.error('Please enter patient age');

    let finalAddress = null;
    if (isAddingAddress) {
      if (!newAddress.streetAddress || !newAddress.city || !newAddress.pincode) {
        return toast.error('Please fill in all address fields');
      }
      finalAddress = {
        fullName: newAddress.fullName || user.name,
        phoneNumber: newAddress.phoneNumber || user.phone,
        streetAddress: newAddress.streetAddress,
        city: newAddress.city,
        state: newAddress.state,
        pincode: newAddress.pincode
      };
    } else {
      const savedAddress = user.addresses?.[selectedAddressIndex];
      if (!savedAddress) {
        return toast.error('Please add a collection address');
      }
      finalAddress = {
        fullName: savedAddress.name || user.name,
        phoneNumber: savedAddress.phone || user.phone,
        streetAddress: savedAddress.addressLine1 + (savedAddress.addressLine2 ? `, ${savedAddress.addressLine2}` : ''),
        city: savedAddress.city || 'Default City',
        state: savedAddress.state || 'Default State',
        pincode: savedAddress.pincode
      };
    }

    setBookingLoading(true);
    try {
      const finalPrice = test.discountedPrice || test.price;

      if (paymentMethod === 'Online') {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          setBookingLoading(false);
          return toast.error('Razorpay SDK failed to load. Are you online?');
        }

        const rzpOrder = await createRazorpayOrder(token, finalPrice);

        const options = {
          key: rzpOrder.keyId,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency || 'INR',
          name: 'MediQuick Lab Diagnostics',
          description: test.name,
          order_id: rzpOrder.razorpayOrderId,
          handler: async (response) => {
            try {
              await verifyRazorpayPayment(token, response);
              const bookingData = {
                testId: id,
                patientName,
                patientAge: Number(patientAge),
                patientGender,
                scheduledDate: selectedDate,
                scheduledTimeSlot: selectedSlot,
                address: finalAddress,
                paymentMethod: 'Online',
                paymentStatus: 'Paid'
              };
              const result = await createLabTestBooking(token, bookingData);
              setSuccessBooking(result);
              toast.success('Lab test booked & paid successfully!');
            } catch (err) {
              toast.error(err.message || 'Payment verification failed');
            } finally {
              setBookingLoading(false);
            }
          },
          prefill: {
            name: patientName,
            email: user?.email || '',
            contact: patientPhone || user?.phone || ''
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

      // Cash on Sample Collection flow
      const bookingData = {
        testId: id,
        patientName,
        patientAge: Number(patientAge),
        patientGender,
        scheduledDate: selectedDate,
        scheduledTimeSlot: selectedSlot,
        address: finalAddress,
        paymentMethod: 'COD',
        paymentStatus: 'Pending'
      };

      const result = await createLabTestBooking(token, bookingData);
      setSuccessBooking(result);
      toast.success('Lab test booked successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to submit booking');
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

  if (successBooking) {
    return (
      <div className="min-h-[calc(100vh-100px)] bg-[#FAFBFD] pt-20 pb-12 flex flex-col items-center justify-center px-4 relative">
        {/* Subtle background celebratory aura */}
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
          {/* Animated checkmark badge */}
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

            {/* Sparkles accent icons */}
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
              Appointment Scheduled
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug mb-1.5" style={{ letterSpacing: '-0.02em' }}>
              Booking Confirmed!
            </h2>
            <p className="text-xs text-slate-400 font-semibold mb-6">
              Ref ID: <span className="font-mono text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded">{successBooking._id}</span>
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-slate-50/80 backdrop-blur-xs rounded-2xl p-4 text-left space-y-3 mb-8 border border-slate-100/80 shadow-inner"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">Patient Name</span>
              <span className="text-slate-800 font-bold">{successBooking.patientName}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">Scheduled Date</span>
              <span className="text-slate-800 font-bold">{successBooking.scheduledDate}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">Scheduled Window</span>
              <span className="text-slate-800 font-bold">{successBooking.scheduledTimeSlot}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">Payment Status</span>
              <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${successBooking.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {successBooking.paymentStatus}
              </span>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            onClick={() => navigate('/profile?tab=lab-bookings')}
            className="w-full py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition-all cursor-pointer shadow-lg shadow-slate-900/10 active:scale-98"
          >
            View My Bookings
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const savedAddresses = user?.addresses || [];

  return (
    <div className="min-h-screen bg-[#FAFBFD] pb-24 pt-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Back link */}
        <button 
          onClick={() => navigate(`/lab-tests/${id}`)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-850 mb-8 transition-colors"
        >
          <ChevronLeft size={14} />
          <span>Back to Package details</span>
        </button>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-8">
          Schedule Home Collection
        </h1>

        <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Booking Form */}
          <div className="md:col-span-2 space-y-6">
            
            {/* 1. Schedule Picker */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CalendarIcon size={14} className="text-[#00a2a4]" /> 1. Select Date & Time
              </h3>

              {/* Date selection grid */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {availableDates.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setSelectedDate(d.value)}
                    className={`py-3 px-2 text-center rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                      selectedDate === d.value 
                        ? 'border-[#00a2a4] bg-[#00a2a4]/5 text-[#00a2a4]' 
                        : 'border-slate-200/60 hover:border-slate-400 bg-white text-slate-600'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {/* Time slot picker */}
              {selectedDate && (
                <div className="mt-4 pt-4 border-t border-slate-55">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Clock size={12} /> Choose Time Window
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 px-3 text-left rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                          selectedSlot === slot 
                            ? 'border-[#00a2a4] bg-[#00a2a4]/5 text-[#00a2a4]' 
                            : 'border-slate-250/50 hover:border-slate-400 bg-white text-slate-600'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Patient Details Form */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User size={14} className="text-[#00a2a4]" /> 2. Patient Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Patient Name</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-[#00a2a4] focus:bg-white transition-all text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Patient Age</label>
                  <input
                    type="number"
                    required
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="Enter age (e.g. 35)"
                    className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-[#00a2a4] focus:bg-white transition-all text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Patient Gender</label>
                  <div className="flex gap-2">
                    {['Male', 'Female', 'Other'].map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => setPatientGender(gender)}
                        className={`flex-1 py-2 px-3 text-center rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                          patientGender === gender 
                            ? 'border-[#00a2a4] bg-[#00a2a4]/5 text-[#00a2a4]' 
                            : 'border-slate-200 bg-white text-slate-500'
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Contact Number</label>
                  <input
                    type="text"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-[#00a2a4] focus:bg-white transition-all text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* 3. Collection Address */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MapPin size={14} className="text-[#00a2a4]" /> 3. Sample Collection Address
              </h3>

              {!isAddingAddress ? (
                <div className="space-y-3">
                  {savedAddresses.map((addr, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedAddressIndex(idx)}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                        selectedAddressIndex === idx 
                          ? 'border-[#00a2a4] bg-[#00a2a4]/4' 
                          : 'border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-700 block">{addr.name} — {addr.phone}</span>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                        {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}, {addr.city}, {addr.state} ({addr.pincode})
                      </span>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(true)}
                    className="w-full py-2.5 border border-dashed border-slate-200 hover:border-[#00a2a4] hover:text-[#00a2a4] text-slate-400 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    + Add New Collection Address
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Street Address</label>
                      <input
                        type="text"
                        value={newAddress.streetAddress}
                        onChange={(e) => setNewAddress({...newAddress, streetAddress: e.target.value})}
                        placeholder="House / Flat No., Area"
                        className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2 text-xs font-semibold outline-none focus:border-[#00a2a4] focus:bg-white transition-all text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">City</label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        placeholder="City"
                        className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2 text-xs font-semibold outline-none focus:border-[#00a2a4] focus:bg-white transition-all text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">State</label>
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                        placeholder="State"
                        className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2 text-xs font-semibold outline-none focus:border-[#00a2a4] focus:bg-white transition-all text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Pincode</label>
                      <input
                        type="text"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                        placeholder="6-digit Pincode"
                        className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2 text-xs font-semibold outline-none focus:border-[#00a2a4] focus:bg-white transition-all text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="flex-1 py-2 rounded-xl bg-slate-50 text-slate-500 text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      Use Saved Addresses
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Checkout Info */}
          <div>
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-xs sticky top-28 space-y-6">
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Order Summary</h3>
                <div className="flex justify-between items-start gap-4">
                  <span className="text-xs font-bold text-slate-800 leading-snug">{test.name}</span>
                  <span className="text-xs font-bold text-slate-900 shrink-0">₹{test.discountedPrice || test.price}</span>
                </div>
              </div>

              {/* Payment selection */}
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Payment Method</h3>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      paymentMethod === 'COD' 
                        ? 'border-[#00a2a4] bg-[#00a2a4]/4 text-[#00a2a4]' 
                        : 'border-slate-100 hover:border-slate-300 text-slate-600 bg-white'
                    }`}
                  >
                    <Building size={14} />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">Pay at Collection</span>
                      <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Cash / UPI during sample drop</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Online')}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      paymentMethod === 'Online' 
                        ? 'border-[#00a2a4] bg-[#00a2a4]/4 text-[#00a2a4]' 
                        : 'border-slate-100 hover:border-slate-300 text-slate-600 bg-white'
                    }`}
                  >
                    <CreditCard size={14} />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">Pay Online</span>
                      <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Instant online confirmation</span>
                    </div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-slate-900 border border-transparent text-xs font-bold text-white hover:bg-slate-800 transition-all cursor-pointer shadow-lg shadow-slate-900/10 active:scale-98"
              >
                {bookingLoading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <>
                    <CheckCircle size={13} />
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LabTestBooking;
