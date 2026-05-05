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
    <footer className="bg-slate-900 pt-10 pb-20 md:pb-6 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                <Heart className="h-5 w-5 fill-current" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Medi<span className="text-blue-500">Quick</span>
              </span>
            </Link>
            <p className="text-[13px] leading-relaxed max-w-xs text-slate-400">
              Your trusted partner in healthcare. Delivering quality medicines and healthcare essentials directly to your doorstep.
            </p>
            <div className="flex items-center gap-3">
              <SocialIcon icon={<Facebook size={18} />} href="#" />
              <SocialIcon icon={<Twitter size={18} />} href="#" />
              <SocialIcon icon={<Instagram size={18} />} href="#" />
              <SocialIcon icon={<Youtube size={18} />} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-3">Quick Links</h4>
            <ul className="space-y-2 text-[13px] font-medium">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/medicines" label="Medicines" />
              <FooterLink to="/lab-tests" label="Lab Tests" />
              <FooterLink to="/ayurveda" label="Ayurveda" />
              <FooterLink to="/offers" label="Offers & Deals" />
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-3">Customer Care</h4>
            <ul className="space-y-2 text-[13px] font-medium">
              <FooterLink to="/profile" label="My Account" />
              <FooterLink to="/my-orders" label="Order Tracking" />
              <FooterLink to="/wishlist" label="Wishlist" />
              <FooterLink to="/care-plan" label="Health Care Plan" />
              <FooterLink to="/contact" label="Help & Support" />
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-3">Contact Us</h4>
            <div className="space-y-2">
              <ContactItem icon={<Phone size={16} className="text-blue-500" />} text="+91 98765 43210" />
              <ContactItem icon={<Mail size={16} className="text-blue-500" />} text="support@mediquick.com" />
              <ContactItem icon={<MapPin size={16} className="text-blue-500" />} text="Amritsar Hub, Punjab, India - 143001" />
            </div>
          </div>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-slate-800 mb-6">
          <FeatureItem icon={<ShieldCheck size={24} className="text-blue-500" />} title="100% Genuine" desc="Products from verified hubs" />
          <FeatureItem icon={<Truck size={24} className="text-blue-500" />} title="Free Delivery" desc="On orders above ₹499" />
          <FeatureItem icon={<CreditCard size={24} className="text-blue-500" />} title="Secure Payment" desc="SSL Encrypted transactions" />
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-medium text-slate-500">
            © {currentYear} MediQuick Pharmaceuticals. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" className="h-5 opacity-40 hover:opacity-100 transition-opacity" />
            <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" className="h-5 opacity-40 hover:opacity-100 transition-opacity" />
            <img src="https://img.icons8.com/color/48/upi.png" alt="UPI" className="h-5 opacity-40 hover:opacity-100 transition-opacity" />
            <img src="https://img.icons8.com/color/48/google-pay.png" alt="GPay" className="h-5 opacity-40 hover:opacity-100 transition-opacity" />
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
