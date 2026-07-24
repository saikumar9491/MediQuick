import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ChevronDown, User, Bell, Loader2, X, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../utils/apiConfig';
import toast from 'react-hot-toast';

const MobileHeader = ({ isHidden = false }) => {
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
        toast.success(`Location updated to ${city}`);
      } catch (err) {
        toast.error('Could not auto-detect location');
      } finally {
        setIsDetecting(false);
      }
    }, (err) => {
      setIsDetecting(false);
      toast.error('Location permission denied or unavailable');
    });
  };

  const handleManualPincode = async (e) => {
    e.preventDefault();
    if (!pincodeInput || pincodeInput.trim().length !== 6) {
      toast.error('Please enter a valid 6-digit PIN code');
      return;
    }

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincodeInput.trim()}`);
      const data = await res.json();
      if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        const area = po.District || po.Name || 'Area';
        saveLocation(area);
      } else {
        saveLocation('Pincode Area');
      }
    } catch (err) {
      saveLocation('Pincode Area');
    }
  };

  const saveLocation = (area) => {
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
      <header className={`fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200/80 h-13 px-2.5 sm:px-4 flex items-center justify-between gap-1 select-none transition-transform duration-300 ease-in-out ${
        isHidden ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}>
        {/* 1. Left: Compact Logo */}
        <Link to="/" className="flex items-center gap-1 shrink-0">
          <div className="flex h-5.5 w-5.5 items-center justify-center rounded-md bg-[#0057FF] text-white shadow-2xs">
            <span className="text-[10px] font-black">M</span>
          </div>
          <span className="text-[11px] sm:text-xs font-black tracking-tight uppercase">
            <span className="text-[#0057FF]">MEDI</span><span className="text-[#FF6B00]">QUICK</span>
          </span>
        </Link>

        {/* 2. Center: Compact Location Pill */}
        <button
          onClick={() => setShowLocationModal(true)}
          className="flex items-center gap-1 max-w-[105px] xs:max-w-[125px] sm:max-w-[160px] bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-full text-[10.5px] font-bold text-slate-700 shadow-3xs active:scale-95 transition-all hover:bg-slate-100 shrink-1 overflow-hidden"
          title="Select Location"
        >
          <MapPin size={10} className="text-[#0057FF] shrink-0" />
          <span className="truncate">{locationName} {userPincode}</span>
          <ChevronDown size={9} className="text-slate-400 shrink-0" />
        </button>

        {/* 3. Right: Flash Sale, Notification and Profile Icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Flash Sale Pill */}
          <Link 
            to="/medicines?filter=flash"
            className="flex items-center gap-0.5 bg-gradient-to-r from-[#FF6B00] to-[#EF4444] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs animate-pulse active:scale-95 transition-all"
            title="Flash Deals"
          >
            <Zap size={10} className="fill-current" />
            <span>FLASH</span>
          </Link>

          {/* Notification Bell */}
          <button 
            onClick={() => navigate('/notifications')} 
            className="p-1 text-slate-600 hover:text-slate-900 transition-colors active:scale-95"
            title="Notifications"
          >
            <Bell size={17} />
          </button>
          
          {/* Profile / Account Icon */}
          <Link 
            to={user ? "/profile" : "/login"} 
            className="h-6.5 w-6.5 rounded-full bg-slate-100 border border-slate-200/90 overflow-hidden flex items-center justify-center active:scale-95 shrink-0"
            title={user ? "Account" : "Login"}
          >
            {user?.image ? (
              <img src={user.image} className="h-full w-full object-cover" alt="Profile" />
            ) : (
              <User size={14} className="text-slate-600" />
            )}
          </Link>
        </div>
      </header>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl animate-fadeIn relative">
            <button
              onClick={() => setShowLocationModal(false)}
              className="absolute right-4 top-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-blue-50 text-[#0057FF]">
                <MapPin size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Select Delivery Location</h3>
                <p className="text-[10px] font-bold text-slate-400">Pincode determines medicine availability</p>
              </div>
            </div>

            {/* Auto Detect Button */}
            <button
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className="w-full mb-4 flex items-center justify-center gap-2 rounded-xl bg-[#0057FF] hover:bg-[#0046CC] text-white py-2.5 text-xs font-black uppercase tracking-wider shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isDetecting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Detecting GPS Location...</span>
                </>
              ) : (
                <>
                  <MapPin size={14} />
                  <span>Use Current GPS Location</span>
                </>
              )}
            </button>

            <div className="relative flex items-center justify-center mb-4">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-2 text-[10px] font-black uppercase tracking-widest text-slate-400 absolute">OR</span>
            </div>

            {/* Manual Pincode Input */}
            <form onSubmit={handleManualPincode} className="space-y-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">
                  Enter 6-Digit Pincode
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 144411"
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#0057FF] transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-2.5 text-xs font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
              >
                Apply Pincode
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileHeader;
