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
import { API_BASE } from './utils/apiConfig';
import { useGoogleOneTapLogin } from '@react-oauth/google';

// Pages
import Home from './pages/Home';
import Checkout from './pages/Checkout/Checkout';
import OrderConfirmation from './pages/Checkout/OrderConfirmation';
import MyOrders from './pages/MyOrders/MyOrders';
import VerifyOtp from './pages/Auth/VerifyOtp'; // 🛰️ IMPORTED VERIFY OTP
import AuthModal from './components/AuthModal/AuthModal'; // 🛰️ IMPORTED AUTH MODAL
import ResetPassword from './pages/Auth/ResetPassword';
import Wishlist from './pages/Wishlist/Wishlist';
import Profile from './pages/Profile/Profile';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import BrandPage from './pages/BrandPage';
import Cart from './pages/Cart/Cart';
import MedicinesPage from './pages/MedicinesPage';
import ConsultPage from './pages/ConsultPage';
import AyurvedaPage from './pages/AyurvedaPage';
import CarePlanPage from './pages/CarePlanPage';
import SkinCarePage from './pages/SkinCarePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminFlashDeals from './pages/AdminFlashDeals';
import AddProduct from './pages/admin/AddProduct/AddProduct';
import Orders from './pages/admin/Orders/Orders';
import AdminTrendingProducts from './pages/AdminTrendingProducts';
import AllCategoriesPage from './pages/Categories/AllCategoriesPage';
import AdminLayout from './components/admin/AdminLayout';
import CommandCenter from './pages/admin/CommandCenter/CommandCenter';
import Products from './pages/admin/Products/Products';
import AdminPlaceholder from './pages/admin/AdminPlaceholder';
import POSTerminal from './pages/admin/POSTerminal/POSTerminal';
import Logistics from './pages/admin/Logistics/Logistics';
import LiveRadar from './pages/admin/LiveRadar/LiveRadar';
import Complaints from './pages/admin/Complaints/Complaints';
import ReturnsRefunds from './pages/admin/ReturnsRefunds/ReturnsRefunds';
import ABTesting from './pages/admin/ABTesting/ABTesting.jsx';
import NotificationComposer from './pages/admin/NotificationComposer/NotificationComposer.jsx';
import AIPricing from './pages/admin/AIPricing/AIPricing.jsx';
import SearchDiscovery from './pages/admin/SearchDiscovery/SearchDiscovery.jsx';
import Reviews from './pages/admin/Reviews/Reviews.jsx';
import Messages from './pages/admin/Messages/Messages.jsx';
import Fleet from './pages/admin/Fleet/Fleet';
import Coupons from './pages/admin/Coupons/Coupons';
import AbandonedCart from './pages/admin/AbandonedCart/AbandonedCart';
import Marketing from './pages/admin/Marketing/Marketing';
import DoctorDetailsPage from './pages/DoctorDetailsPage';
import RaiseComplaint from './pages/RaiseComplaint';
import LabTestsHome from './pages/LabTests/LabTestsHome';
import LabTestDetail from './pages/LabTests/LabTestDetail';
import LabTestBooking from './pages/LabTests/LabTestBooking';
import LabTestsAdmin from './pages/admin/LabTests/LabTestsAdmin';
import LabBookingsAdmin from './pages/admin/LabTests/LabBookingsAdmin';
import DoctorsAdmin from './pages/admin/Doctors/DoctorsAdmin';
import DoctorAppointmentsAdmin from './pages/admin/Doctors/DoctorAppointmentsAdmin';
import PageManagementAdmin from './pages/admin/PageManagement/PageManagementAdmin';

// Global Components
import WhatsAppSupport from './components/common/WhatsAppSupport';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';
import ScrollToTop from './components/common/ScrollToTop';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen message="Loading Secure Access..." icon="💊" />;
  return user ? <Outlet /> : <Navigate to="/" replace />;
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

const GoogleOneTapPrompt = () => {
  const { user, login } = useAuth();
  
  useGoogleOneTapLogin({
    onSuccess: async (credentialResponse) => {
      try {
        const res = await fetch(`${API_BASE}/api/users/google-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: credentialResponse.credential }),
        });
        const data = await res.json();
        if (res.ok) {
          login(data.token, data.user);
          import('react-hot-toast').then(({ default: toast }) => {
            toast.success("Welcome back to MediQuick!");
          });
        }
      } catch (error) {
        console.error("Google One Tap Error:", error);
      }
    },
    onError: () => {
      console.log('Google One Tap Failed');
    },
    disabled: !!user, // Disable if user is already logged in
    cancel_on_tap_outside: false // Prevent accidental dismissal which triggers the 2-hour cooldown
  });

  return null;
};

function AppLayout({ medicines, featured, loading }) {
  const location = useLocation();
  const { user } = useAuth();

  // 🛡️ Added /verify-otp to hidden routes to maintain focus
  const hideNavbarRoutes = ['/verify-otp', '/reset-password', '/admin'];
  const hideWhatsAppRoutes = ['/admin', '/verify-otp', '/reset-password'];
  const hideFooterRoutes = ['/admin', '/verify-otp', '/reset-password'];

  const shouldHideNavbar =
    hideNavbarRoutes.some(r => location.pathname.startsWith(r)) ||
    location.pathname === '/admin' ||
    location.pathname.startsWith('/admin');
  const shouldHideWhatsApp = hideWhatsAppRoutes.some(r => location.pathname.startsWith(r));
  const shouldHideFooter = 
    hideFooterRoutes.some(r => location.pathname.startsWith(r)) || 
    location.pathname.startsWith('/admin') || 
    location.pathname.endsWith('/book');

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: { fontSize: '12px', fontWeight: '700' },
        }}
      />
      
      <AuthModal />
      {!user && <GoogleOneTapPrompt />}

      {!shouldHideNavbar && <Navbar medicines={medicines} />}

      <main className={!shouldHideNavbar ? 'min-h-[80vh]' : ''}>
        <Routes>
          <Route path="/" element={<Home medicines={medicines} featured={featured} loading={loading} />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/brand/:brandName" element={<BrandPage />} />

          <Route path="/medicines" element={<MedicinesPage />} />
          <Route path="/categories" element={<AllCategoriesPage />} />
          <Route path="/lab-tests" element={<LabTestsHome />} />
          <Route path="/lab-tests/:id" element={<LabTestDetail />} />
          <Route path="/lab_tests" element={<LabTestsHome />} />
          <Route path="/lab_tests/:id" element={<LabTestDetail />} />
          <Route path="/consult" element={<ConsultPage />} />
          <Route path="/consult-doctor" element={<ConsultPage />} />
          <Route path="/consult-doctor/:id" element={<DoctorDetailsPage />} />
          <Route path="/doctor-details/:id" element={<DoctorDetailsPage />} />
          <Route path="/ayurveda" element={<AyurvedaPage />} />
          <Route path="/category/ayurveda" element={<AyurvedaPage />} />
          <Route path="/care-plan" element={<CarePlanPage />} />
          <Route path="/skin-care" element={<SkinCarePage />} />
          <Route path="/offers" element={<div className="pt-24 p-4 text-center font-bold">Offers coming soon!</div>} />

          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/medicines/:id" element={<ProductDetails />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/lab-tests/:id/book" element={<LabTestBooking />} />
            <Route path="/lab_tests/:id/book" element={<LabTestBooking />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/raise-complaint" element={<RaiseComplaint />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<CommandCenter />} />
              <Route path="products" element={<Products />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="edit-product/:id" element={<AddProduct />} />
              <Route path="orders" element={<Orders />} />
              <Route path="lab-tests" element={<LabTestsAdmin />} />
              <Route path="lab-bookings" element={<LabBookingsAdmin />} />
              <Route path="doctors" element={<DoctorsAdmin />} />
              <Route path="doctor-appointments" element={<DoctorAppointmentsAdmin />} />
              <Route path="page-management" element={<PageManagementAdmin />} />
              <Route path="pos-terminal" element={<POSTerminal />} />
              <Route path="logistics" element={<Logistics />} />
              <Route path="live-radar" element={<LiveRadar />} />
              <Route path="complaints" element={<Complaints />} />
              <Route path="returns" element={<ReturnsRefunds />} />
              <Route path="flash-sales" element={<AdminFlashDeals />} />
              <Route path="ai-pricing" element={<AIPricing />} />
              <Route path="notifications-composer" element={<NotificationComposer />} />
              <Route path="ab-testing" element={<ABTesting />} />
              <Route path="customers" element={<AdminPlaceholder pageName="Customers" />} />
              <Route path="search-discovery" element={<SearchDiscovery />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="messages" element={<Messages />} />
              <Route path="returns" element={<ReturnsRefunds />} />

              {/* Marketing & Growth */}
              <Route path="marketing" element={<Marketing />} />
              <Route path="coupons" element={<Coupons />} />
              <Route path="abandoned-cart" element={<AbandonedCart />} />
              
              {/* Analytics & Reports */}
              <Route path="sales-report" element={<AdminPlaceholder pageName="Sales Report" />} />
              
              {/* Operations & Logistics */}
              <Route path="logistics" element={<Logistics />} />
              <Route path="fleet" element={<Fleet />} />
              <Route path="live-radar" element={<LiveRadar />} />
              
              {/* System & Settings */}
              <Route path="search-discovery" element={<AdminPlaceholder pageName="Search & Discovery" />} />
              <Route path="support-console" element={<AdminPlaceholder pageName="Support Console" />} />
              <Route path="inventory-alerts" element={<AdminPlaceholder pageName="Inventory Alerts" />} />
              <Route path="live-ops" element={<AdminPlaceholder pageName="Live Ops" />} />
              <Route path="xray-monitor" element={<AdminPlaceholder pageName="X-Ray Monitor" />} />
              <Route path="analytics" element={<AdminPlaceholder pageName="Analytics" />} />
              <Route path="settings" element={<AdminPlaceholder pageName="Settings" />} />
              <Route path="trending" element={<AdminTrendingProducts />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!shouldHideFooter && <Footer />}
      {!shouldHideWhatsApp && <WhatsAppSupport />}
    </>
  );
}

function App() {
  const { loading: authLoading } = useAuth();
  const [medicines, setMedicines] = useState(() => {
    try {
      const cached = localStorage.getItem('mq_medicines');
      const parsed = cached ? JSON.parse(cached) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [featured, setFeatured] = useState(() => {
    try {
      const cached = localStorage.getItem('mq_featured');
      const parsed = cached ? JSON.parse(cached) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [medicinesLoading, setMedicinesLoading] = useState(!medicines.length);

  useEffect(() => {
    // Ping to wake up server
    fetch(`${API_BASE}/`)
      .then(() => console.log('📡 Amritsar Hub Satellite Linked'))
      .catch(() => console.log('🛰️ Hub Initializing...'));

    const fetchData = async () => {
      try {
        const [medRes, topRes] = await Promise.all([
          fetch(`${API_BASE}/api/medicines?limit=1000`),
          fetch(`${API_BASE}/api/medicines/top?limit=1000`)
        ]);
        
        const medData = await medRes.json();
        const topData = await topRes.json();

        const medArray = Array.isArray(medData) ? medData : (medData.medicines || []);
        const topArray = Array.isArray(topData) ? topData : (topData.medicines || []);

        setMedicines(medArray);
        setFeatured(topArray);

        // Cache for next time
        localStorage.setItem('mq_medicines', JSON.stringify(medArray));
        localStorage.setItem('mq_featured', JSON.stringify(topArray));
      } catch (err) {
        console.error('Search sync error:', err);
        // Fallback to cache is already handled by initial state
      } finally {
        setMedicinesLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AppLayout 
        medicines={medicines} 
        featured={featured} 
        loading={medicinesLoading} 
      />
    </Router>
  );
}

export default App;
