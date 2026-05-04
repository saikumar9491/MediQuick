import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  ShieldCheck,
  Truck,
  CreditCard,
  Heart
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 pt-16 pb-24 md:pb-8 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                <Heart className="h-6 w-6 fill-current" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Medi<span className="text-blue-500">Quick</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-slate-400">
              Your trusted partner in healthcare. Delivering quality medicines and healthcare essentials directly to your doorstep from our Amritsar Hub.
            </p>
            <div className="flex items-center gap-4">
              <SocialIcon icon={<Facebook className="h-5 w-5" />} href="#" />
              <SocialIcon icon={<Twitter className="h-5 w-5" />} href="#" />
              <SocialIcon icon={<Instagram className="h-5 w-5" />} href="#" />
              <SocialIcon icon={<Youtube className="h-5 w-5" />} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/medicines" label="Medicines" />
              <FooterLink to="/lab-tests" label="Lab Tests" />
              <FooterLink to="/ayurveda" label="Ayurveda" />
              <FooterLink to="/offers" label="Offers & Deals" />
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Customer Care</h4>
            <ul className="space-y-4 text-sm font-medium">
              <FooterLink to="/profile" label="My Account" />
              <FooterLink to="/my-orders" label="Order Tracking" />
              <FooterLink to="/wishlist" label="Wishlist" />
              <FooterLink to="/care-plan" label="Health Care Plan" />
              <FooterLink to="/contact" label="Help & Support" />
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Contact Us</h4>
            <div className="space-y-4">
              <ContactItem icon={<Phone className="h-5 w-5 text-blue-500" />} text="+91 98765 43210" />
              <ContactItem icon={<Mail className="h-5 w-5 text-blue-500" />} text="support@mediquick.com" />
              <ContactItem icon={<MapPin className="h-5 w-5 text-blue-500" />} text="Amritsar Hub, Punjab, India - 143001" />
            </div>
          </div>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-10 border-y border-slate-800 mb-10">
          <FeatureItem icon={<ShieldCheck className="h-8 w-8 text-blue-500" />} title="100% Genuine" desc="Products from verified hubs" />
          <FeatureItem icon={<Truck className="h-8 w-8 text-blue-500" />} title="Free Delivery" desc="On orders above ₹499" />
          <FeatureItem icon={<CreditCard className="h-8 w-8 text-blue-500" />} title="Secure Payment" desc="SSL Encrypted transactions" />
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-medium text-slate-500">
            © {currentYear} MediQuick Pharmaceuticals. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
            <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
            <img src="https://img.icons8.com/color/48/upi.png" alt="UPI" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
            <img src="https://img.icons8.com/color/48/google-pay.png" alt="GPay" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, href }) => (
  <a href={href} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm">
    {icon}
  </a>
);

const FooterLink = ({ to, label }) => (
  <li>
    <Link to={to} className="text-slate-400 hover:text-blue-500 transition-colors">
      {label}
    </Link>
  </li>
);

const ContactItem = ({ icon, text }) => (
  <div className="flex items-start gap-4">
    <div className="mt-0.5">{icon}</div>
    <p className="text-sm text-slate-400">{text}</p>
  </div>
);

const FeatureItem = ({ icon, title, desc }) => (
  <div className="flex items-center gap-4">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 shadow-inner">
      {icon}
    </div>
    <div>
      <h5 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h5>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  </div>
);

export default Footer;
