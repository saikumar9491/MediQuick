import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ChevronDown, User, Bell, Loader2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../utils/apiConfig';
import toast from 'react-hot-toast';

const MobileHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [locationName, setLocationName] = useState(() => localStorage.getItem('locationName') || 'Phagwara');
  const [userPincode, setUserPincode] = useState(() => localStorage.getItem('userPincode') || '144411');
  const [isDetecting, setIsDetecting] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pincodeInput, setPincodeInput] = useState('');

  useEffect(() => {
    const handleLocationChange = () => {
      setLocationName(localStorage.getItem('locationName') || 'Phagwara');
      setUserPincode(localStorage.getItem('userPincode') || '144411');
    };
    window.addEventListener('locationChanged', handleLocationChange);
    return () => window.removeEventListener('locationChanged', handleLocationChange);
  }, []);

  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`);
        const data = await res.json();
        
        const addr = data.address;
        const city = addr.city || addr.town || addr.village || addr.hamlet || addr.suburb || addr.neighbourhood || addr.state_district || addr.city_district || addr.county || "Current Location";
        const detectedPincode = addr.postcode || '144411';
        
        localStorage.setItem('locationName', city);
        localStorage.setItem('userPincode', detectedPincode);
        
        setLocationName(city);
        setUserPincode(detectedPincode);
        window.dispatchEvent(new Event('locationChanged'));
        setShowLocationModal(false);
        toast.success(`Detected location: ${city} (${detectedPincode})`);
      } catch (error) {
        console.error("Error detecting location:", error);
        toast.error('Failed to resolve address. Please enter a pincode.');
      } finally {
        setIsDetecting(false);
      }
    }, (error) => {
      console.error(error);
      setIsDetecting(false);
      toast.error('Permission denied or location unavailable');
    });
  };

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincodeInput)) {
      toast.error('Please enter a valid 6-digit Pincode');
      return;
    }

    let area = 'Delhi Area';
    if (pincodeInput.startsWith('11')) area = 'New Delhi';
    else if (pincodeInput.startsWith('40')) area = 'Mumbai';
    else if (pincodeInput.startsWith('56')) area = 'Bengaluru';
    else if (pincodeInput.startsWith('60')) area = 'Chennai';
    else if (pincodeInput.startsWith('14')) area = 'Kapurthala';
    else area = `Pincode ${pincodeInput}`;

    localStorage.setItem('locationName', area);
    localStorage.setItem('userPincode', pincodeInput);
    
    setLocationName(area);
    setUserPincode(pincodeInput);
    window.dispatchEvent(new Event('locationChanged'));
    setShowLocationModal(false);
    toast.success(`Location set to ${area} (${pincodeInput})`);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-150 h-14 px-4 flex items-center justify-between">
        {/* Left: Compact Logo */}
        <Link to="/" className="flex items-center gap-1.5 shrink-0">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-[#0057FF] text-white">
            <span className="text-[10px] font-black">M</span>
          </div>
          <span className="text-xs font-black tracking-tight uppercase">
            <span className="text-[#0057FF]">MEDI</span><span className="text-[#FF6B00]">QUICK</span>
          </span>
        </Link>

        {/* Center: Location Pill */}
        <button
          onClick={() => setShowLocationModal(true)}
          className="flex items-center gap-1 max-w-[50%] bg-slate-50 border border-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-3xs active:scale-95 transition-all hover:bg-slate-100"
        >
          <MapPin size={11} className="text-[#0057FF]" />
          <span className="truncate">{locationName} {userPincode}</span>
          <ChevronDown size={10} className="text-slate-400" />
        </button>

        {/* Right: Notification and Profile */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/notifications')} 
            className="p-1 text-slate-500 hover:text-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell size={20} />
          </button>
          
          {user ? (
            <Link 
              to="/profile" 
              className="h-7 w-7 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center"
              title="Account"
            >
              {user?.image ? (
                <img src={user.image} className="h-full w-full object-cover" alt="" />
              ) : (
                <User size={15} className="text-slate-500" />
              )}
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-[#0057FF] hover:bg-[#003BB5] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs transition-all active:scale-95 flex items-center gap-1"
            >
              <span>Login</span>
            </Link>
          )}
        </div>
      </header>

      {/* Location Picker Drawer/Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-xs flex items-end justify-center">
          <div className="bg-white w-full rounded-t-3xl p-6 pb-8 animate-in slide-in-from-bottom duration-300 max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Choose your Delivery Location</h3>
              <button 
                onClick={() => setShowLocationModal(false)} 
                className="p-1 hover:bg-slate-100 rounded-full"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* GPS Detection button */}
            <button
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-[#0057FF] text-xs font-bold transition-all border border-blue-100 mb-6 disabled:opacity-50"
            >
              {isDetecting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Detecting GPS Location...</span>
                </>
              ) : (
                <>
                  <MapPin size={15} />
                  <span>Detect My Location using GPS</span>
                </>
              )}
            </button>

            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-x-0 h-px bg-slate-200"></div>
              <span className="relative bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or enter pincode</span>
            </div>

            {/* Pincode Input Form */}
            <form onSubmit={handlePincodeSubmit} className="space-y-4">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit Pincode (e.g. 144411)"
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-widest text-lg font-black rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3.5 focus:border-[#0057FF] focus:ring-4 focus:ring-blue-50 outline-none"
              />
              <button
                type="submit"
                className="w-full py-4 bg-[#0057FF] hover:bg-[#003BB5] text-white text-xs font-extrabold uppercase tracking-widest rounded-2xl transition-colors shadow-lg shadow-blue-500/10 active:scale-[0.98]"
              >
                Set Location
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileHeader;
