import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Signup() {
  const [role, setRole] = useState('user');

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white rounded-3xl shadow-2xl shadow-primary-500/5 border border-slate-100 p-10 space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
          <p className="text-slate-500">Join our community of service seekers and providers</p>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button 
            onClick={() => setRole('user')}
            className={`flex-1 py-3 rounded-lg font-bold transition-all ${role === 'user' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500'}`}
          >
            I'm a User
          </button>
          <button 
            onClick={() => setRole('provider')}
            className={`flex-1 py-3 rounded-lg font-bold transition-all ${role === 'provider' ? 'bg-white text-secondary-600 shadow-sm' : 'text-slate-500'}`}
          >
            I'm a Provider
          </button>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" placeholder="John Doe" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="email" placeholder="john@example.com" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="tel" placeholder="+1 (555) 000-0000" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
            </div>
          </div>

          <div className="md:col-span-2 space-y-4 pt-4">
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <ShieldCheck className="text-primary-500 shrink-0" size={20} />
              <p className="text-xs text-slate-500">By creating an account, you agree to our Terms of Service and Privacy Policy. Your data is secure and encrypted.</p>
            </div>
            <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2 py-4">
              Create Account <ArrowRight size={20} />
            </button>
          </div>
        </form>

        <div className="text-center text-slate-500">
          Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Sign In</Link>
        </div>
      </motion.div>
    </div>
  );
}
