import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

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

// Global Components
import WhatsAppSupport from './components/common/WhatsAppSupport';
import Navbar from './components/common/Navbar';

// Protected Route Component
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin text-4xl">💊</div>
    </div>
  );
  
  // FIXED: Ensure we return the Navigate component correctly
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    fetch(`${API_BASE}/api/medicines`)
      .then(res => res.json())
      .then(data => setMedicines(Array.isArray(data) ? data : []))
      .catch(err => console.error("Search sync error:", err));
  }, []);

  return (
    <Router>
      <Navbar medicines={medicines} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home medicines={medicines} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/brand/:brandName" element={<BrandPage />} />

        {/* Service Routes */}
        <Route path="/medicines" element={<MedicinesPage />} />
        <Route path="/lab-tests" element={<LabTestsPage />} />
        <Route path="/consult" element={<ConsultPage />} />
        <Route path="/ayurveda" element={<AyurvedaPage />} />
        <Route path="/care-plan" element={<CarePlanPage />} /> 
        <Route path="/skin-care" element={<SkinCarePage />} /> 

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<MedicineDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* FIX: Catch-all route. 
           If a user hits a 'Not Found' path, we redirect them to home 
           instead of showing a blank screen.
        */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <WhatsAppSupport />
    </Router>
  );
}

export default App;