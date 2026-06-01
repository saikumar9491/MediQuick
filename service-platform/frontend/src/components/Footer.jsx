import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-20 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2 text-white">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white">S</div>
            <span>ServeIt</span>
          </Link>
          <p className="text-sm leading-relaxed">
            Connecting you with the best local professionals for all your home and personal needs. Quality service guaranteed.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all"><Facebook size={20} /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all"><Twitter size={20} /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all"><Instagram size={20} /></a>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-bold text-lg">Services</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/services?category=Cleaning" className="hover:text-primary-400 transition-colors">Home Cleaning</Link></li>
            <li><Link to="/services?category=Electrician" className="hover:text-primary-400 transition-colors">Electrician</Link></li>
            <li><Link to="/services?category=Plumbing" className="hover:text-primary-400 transition-colors">Plumbing</Link></li>
            <li><Link to="/services?category=Beauty" className="hover:text-primary-400 transition-colors">Beauty & Salon</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-bold text-lg">Company</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-primary-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-primary-400 transition-colors">How it Works</a></li>
            <li><a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-bold text-lg">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-primary-500" />
              <span>support@serveit.com</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-primary-500" />
              <span>+1 (555) 123-4567</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-20 pt-8 border-t border-white/5 text-center text-xs">
        © 2024 ServeIt Inc. All rights reserved.
      </div>
    </footer>
  );
}
