import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOtp from './pages/Auth/VerifyOtp'; // 🛰️ IMPORTED VERIFY OTP
import ForgotPassword from './pages/ForgotPassword';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import MedicineDetails from './pages/MedicineDetails';
import BrandPage from './pages/BrandPage';
import Cart from './pages/Cart';
import MedicinesPage from './pages/MedicinesPage';
import LabTestsPage from './pages/LabTestsPage';
import ConsultPage from './pages/ConsultPage';
import AyurvedaPage from './pages/AyurvedaPage';
import CarePlanPage from './pages/CarePlanPage';
import SkinCarePage from './pages/SkinCarePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminFlashDeals from './pages/AdminFlashDeals';

// Global Components
import WhatsAppSupport from './components/common/WhatsAppSupport';
import Navbar from './components/common/Navbar';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen message="Loading Secure Access..." icon="💊" />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const AdminRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen message="Checking Admin Access..." icon="⚙️" />;
  return user && user.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

// Reusable Loading Component for Routes
const LoadingScreen = ({ message, icon }) => (
  <div className="min-h-screen flex items-center justify-center bg-white px-4">
    <div className="flex flex-col items-center text-center">
      <div className="animate-spin text-4xl sm:text-5xl">{icon}</div>
      <p className="mt-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-gray-400">
        {message}
      </p>
    </div>
  </div>
);

import { API_BASE } from './utils/apiConfig';

function AppLayout({ medicines, featured, loading }) {
  const location = useLocation();

  // 🛡️ Added /verify-otp to hidden routes to maintain focus
  const hideNavbarRoutes = ['/login', '/signup', '/forgot-password', '/verify-otp'];
  const hideWhatsAppRoutes = ['/login', '/signup', '/forgot-password', '/admin-dashboard', '/verify-otp'];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  const shouldHideWhatsApp =
    hideWhatsAppRoutes.includes(location.pathname) ||
    location.pathname.startsWith('/admin');

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: { fontSize: '12px', fontWeight: '700' },
        }}
      />

      {!shouldHideNavbar && <Navbar medicines={medicines} />}

      <Routes>
        <Route path="/" element={<Home medicines={medicines} featured={featured} loading={loading} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} /> {/* 🛰️ NEW ROUTE ADDED */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/brand/:brandName" element={<BrandPage />} />

        <Route path="/medicines" element={<MedicinesPage />} />
        <Route path="/lab-tests" element={<LabTestsPage />} />
        <Route path="/consult" element={<ConsultPage />} />
        <Route path="/ayurveda" element={<AyurvedaPage />} />
        <Route path="/care-plan" element={<CarePlanPage />} />
        <Route path="/skin-care" element={<SkinCarePage />} />
        <Route path="/offers" element={<div className="pt-24 p-4">Offers Page</div>} />

        <Route path="/product/:id" element={<MedicineDetails />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route
            path="/admin-dashboard"
            element={<AdminDashboard medicines={medicines} />}
          />
          <Route
            path="/admin/flash-deals"
            element={<AdminFlashDeals />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!shouldHideWhatsApp && <WhatsAppSupport />}
    </>
  );
}

function App() {
  const { loading: authLoading } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [medicinesLoading, setMedicinesLoading] = useState(true);

  useEffect(() => {
    // Ping to wake up server
    fetch(`${API_BASE}/`)
      .then(() => console.log('📡 Amritsar Hub Satellite Linked'))
      .catch(() => console.log('🛰️ Hub Initializing...'));

    const fetchData = async () => {
      try {
        const [medRes, topRes] = await Promise.all([
          fetch(`${API_BASE}/api/medicines`),
          fetch(`${API_BASE}/api/medicines/top`)
        ]);
        
        const medData = await medRes.json();
        const topData = await topRes.json();

        setMedicines(Array.isArray(medData) ? medData : []);
        setFeatured(Array.isArray(topData) ? topData : []);
      } catch (err) {
        console.error('Search sync error:', err);
        setMedicines([]);
        setFeatured([]);
      } finally {
        setMedicinesLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Router>
      <AppLayout 
        medicines={medicines} 
        featured={featured} 
        loading={medicinesLoading} 
      />
    </Router>
  );
}

export default App;