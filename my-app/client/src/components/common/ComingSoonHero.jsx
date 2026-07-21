import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Bell, CheckCircle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const ComingSoonHero = ({ title, heroHeadline, heroSubtext }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    toast.success("You've been added to the priority notification waitlist!");
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-[#FAFBFD] pt-12 pb-24 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00a2a4]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-xl w-full bg-white border border-slate-200/70 rounded-[32px] p-8 sm:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.05)] text-center relative"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00a2a4]/10 text-[#00a2a4] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <Sparkles size={12} /> Coming Soon
        </span>

        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-3" style={{ letterSpacing: '-0.02em' }}>
          {heroHeadline || `${title || 'Service'} Launching Soon`}
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-8 max-w-md mx-auto">
          {heroSubtext || "We are currently finalizing verified partnerships and pricing to deliver the best healthcare experience. Join our waitlist for early access."}
        </p>

        {subscribed ? (
          <div className="bg-emerald-50 border border-emerald-200/80 p-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-emerald-700">
            <CheckCircle size={18} />
            <span>You're on the waitlist! We'll notify you first at launch.</span>
          </div>
        ) : (
          <form onSubmit={handleWaitlistSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email for launch priority..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#00a2a4]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-slate-900 hover:bg-[#00a2a4] text-white text-xs font-bold rounded-full transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
              >
                <Bell size={14} />
                <span>Notify Me</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1">
              <ShieldCheck size={12} className="text-[#00a2a4]" />
              <span>No spam. Only essential launch updates.</span>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ComingSoonHero;
