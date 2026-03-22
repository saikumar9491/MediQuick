import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin text-4xl">💊</div>
    </div>
  );
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const AdminRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user && user.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

function App() {
  const { loading: authLoading } = useAuth();
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    // CRITICAL: Ensure this matches your Render Backend URL exactly
    const API_BASE = import.meta.env.VITE_API_URL || 'https://mediquick-53b1.onrender.com';
    
    // 1. WAKE UP PING (Prevents the "Server Error" on first click)
    fetch(`${API_BASE}/`)
      .then(() => console.log("📡 Amritsar Hub Satellite Linked"))
      .catch(() => console.log("🛰️ Hub Initializing..."));

    // 2. FETCH MEDICINES
    fetch(`${API_BASE}/api/medicines`)
      .then(res => res.json())
      .then(data => setMedicines(Array.isArray(data) ? data : []))
      .catch(err => console.error("Search sync error:", err));
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-white">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-xl">🏥</div>
        </div>
        <p className="mt-6 font-black uppercase italic text-[10px] tracking-[5px] text-gray-400 animate-pulse">
          Securing Medical Hub Connection...
        </p>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar medicines={medicines} />

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

        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<MedicineDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard medicines={medicines} />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <WhatsAppSupport />
    </Router>
  );
}

export default App;