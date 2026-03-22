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

// Global Components
import WhatsAppSupport from './components/common/WhatsAppSupport';
import Navbar from './components/common/Navbar';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="flex flex-col items-center text-center">
          <div className="animate-spin text-4xl sm:text-5xl">💊</div>
          <p className="mt-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-gray-400">
            Loading Secure Access...
          </p>
        </div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="flex flex-col items-center text-center">
          <div className="animate-spin text-4xl sm:text-5xl">⚙️</div>
          <p className="mt-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-gray-400">
            Checking Admin Access...
          </p>
        </div>
      </div>
    );
  }

  return user && user.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

function AppLayout({ medicines }) {
  const location = useLocation();

  const hideNavbarRoutes = ['/login', '/signup', '/forgot-password'];
  const hideWhatsAppRoutes = ['/login', '/signup', '/forgot-password', '/admin-dashboard'];

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
          style: {
            fontSize: '12px',
            fontWeight: '700',
          },
        }}
      />

      {!shouldHideNavbar && <Navbar medicines={medicines} />}

      <Routes>
        <Route path="/" element={<Home medicines={medicines} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
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

  useEffect(() => {
    const API_BASE =
      import.meta.env.VITE_API_URL || 'https://mediquick-53b1.onrender.com';

    fetch(`${API_BASE}/`)
      .then(() => console.log('📡 Amritsar Hub Satellite Linked'))
      .catch(() => console.log('🛰️ Hub Initializing...'));

    const fetchMedicines = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/medicines`);
        const data = await res.json();
        setMedicines(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Search sync error:', err);
        setMedicines([]);
      }
    };

    fetchMedicines();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4 text-center">
        <div className="relative">
          <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-lg sm:text-xl">
            🏥
          </div>
        </div>

        <p className="mt-5 sm:mt-6 font-black uppercase italic text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.35em] text-gray-400 animate-pulse">
          Securing Medical Hub Connection...
        </p>
      </div>
    );
  }

  return (
    <Router>
      <AppLayout medicines={medicines} />
    </Router>
  );
}

export default App;