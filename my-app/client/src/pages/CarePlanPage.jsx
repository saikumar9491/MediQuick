import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  Crown, 
  Gem, 
  Clock, 
  Truck, 
  CheckCircle2, 
  Plus, 
  ChevronDown,
  ChevronRight,
  Gift,
  Star,
  Users
} from 'lucide-react';

const CarePlanPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [isYearly, setIsYearly] = useState(true);

  const perks = [
    {
      title: "Zero Delivery Fee",
      desc: "Unlimited free deliveries on all orders above ₹199.",
      icon: <Truck size={24} />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Extra 10% Savings",
      desc: "Additional flat discount on top of existing offers.",
      icon: <Zap size={24} />,
      color: "from-amber-500 to-orange-500"
    },
    {
      title: "Priority Lab Reports",
      desc: "Get your diagnostic reports 4-6 hours faster.",
      icon: <Clock size={24} />,
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Premium Support",
      desc: "Skip the queue with a dedicated care manager.",
      icon: <ShieldCheck size={24} />,
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const faqs = [
    { 
      q: "How do I activate my Care Plan?", 
      a: "Once you complete the payment, your MediQuick+ Care status is activated instantly. You will see a 'Plus' badge on your profile." 
    },
    { 
      q: "Can I use Care discounts with other coupons?", 
      a: "Yes! Your 10% Care discount stacks on top of almost all existing website offers and coupons." 
    },
    { 
      q: "Is the membership refundable?", 
      a: "We offer a 7-day 'No Questions Asked' refund policy if you haven't placed any orders using Care benefits." 
    },
    { 
      q: "Does it cover my whole family?", 
      a: "Your membership benefits apply to any order placed from your account, regardless of the patient's name." 
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-amber-600 border border-amber-100"
          >
            <Crown size={14} /> Exclusive Membership
          </motion.div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tight text-slate-800">
            MediQuick+ <span className="text-[#00a2a4]">Care Plan</span>
          </h1>
          <p className="mt-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">
            Premium healthcare benefits designed for your family's wellness
          </p>
        </div>

        {/* Hero Section */}
        <section className="relative mb-20 overflow-hidden rounded-[3rem] bg-slate-900 shadow-2xl">
          {/* Animated Background Gradients */}
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#00a2a4]/20 blur-[100px] animate-pulse" />
          <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-purple-500/10 blur-[100px] animate-pulse" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 sm:p-16">
            <div className="flex flex-col justify-center">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-[#00a2a4] text-white shadow-lg">
                  <Gem size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upgrade to</span>
                  <span className="text-lg font-black uppercase italic text-white">Elite Status</span>
                </div>
              </div>

              <h2 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tighter text-white leading-tight">
                Save More than <br />
                <span className="text-[#00a2a4]">₹12,000 / Year</span>
              </h2>
              
              <p className="mt-6 text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                Join 50,000+ members who enjoy priority consultations, 
                flat discounts, and zero delivery fees.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center gap-6">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl font-black text-white">₹{isYearly ? '199' : '49'}</span>
                    <span className="text-xs font-bold text-slate-500 uppercase">/ {isYearly ? 'Year' : 'Month'}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                    {isYearly ? 'Save 65% with yearly' : 'Try for one month'}
                  </span>
                </div>
                
                <button className="w-full sm:w-auto rounded-2xl bg-[#00a2a4] px-10 py-5 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-teal-900/20 hover:bg-white hover:text-slate-900 transition-all active:scale-95">
                  Become a Member
                </button>
              </div>

              <div className="mt-8 flex items-center gap-4 border-t border-white/5 pt-8">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Joined by <span className="text-white">500+ members</span> today
                </p>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full">
                {perks.map((perk, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={perk.title}
                    className="group rounded-3xl bg-white/5 p-6 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all cursor-default"
                  >
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${perk.color} text-white shadow-lg`}>
                      {perk.icon}
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-white mb-2">{perk.title}</h4>
                    <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed">{perk.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Plan Selector */}
        <div className="mb-20 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-white p-2 shadow-xl border border-slate-100">
            <button 
              onClick={() => setIsYearly(false)}
              className={`rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${!isYearly ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsYearly(true)}
              className={`rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${isYearly ? 'bg-[#00a2a4] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Yearly <span className="ml-1 text-[8px] opacity-70">(Save 65%)</span>
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <section className="mb-20">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-800">
              Why <span className="text-[#00a2a4]">Care Membership?</span>
            </h2>
            <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">See the difference in your healthcare journey</p>
          </div>

          <div className="overflow-hidden rounded-[3rem] bg-white shadow-2xl shadow-slate-200/50 border border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="p-8 text-xs font-black uppercase tracking-widest text-slate-400">Benefit Category</th>
                    <th className="p-8 text-center text-xs font-black uppercase tracking-widest text-slate-400">Guest User</th>
                    <th className="p-8 text-center text-xs font-black uppercase tracking-widest text-teal-600 bg-teal-50/50">Care Member</th>
                  </tr>
                </thead>
                <tbody className="text-[11px] font-bold uppercase tracking-wide">
                  <tr className="border-b border-slate-50">
                    <td className="p-8">Medicine Discounts</td>
                    <td className="p-8 text-center text-slate-400">Standard 20%</td>
                    <td className="p-8 text-center text-teal-600 bg-teal-50/30 font-black">Flat 25% + 5% Bonus</td>
                  </tr>
                  <tr className="border-b border-slate-50">
                    <td className="p-8">Delivery Fees</td>
                    <td className="p-8 text-center text-slate-400">₹49 per order</td>
                    <td className="p-8 text-center text-teal-600 bg-teal-50/30 font-black">FREE (Zero Minimum)</td>
                  </tr>
                  <tr className="border-b border-slate-50">
                    <td className="p-8">Lab Test Reports</td>
                    <td className="p-8 text-center text-slate-400">24-48 Hours</td>
                    <td className="p-8 text-center text-teal-600 bg-teal-50/30 font-black">Fast-Track (6-12h)</td>
                  </tr>
                  <tr className="border-b border-slate-50">
                    <td className="p-8">Doctor Consultations</td>
                    <td className="p-8 text-center text-slate-400">Standard Queue</td>
                    <td className="p-8 text-center text-teal-600 bg-teal-50/30 font-black">VIP Instant Access</td>
                  </tr>
                  <tr>
                    <td className="p-8">Special Health Rewards</td>
                    <td className="p-8 text-center text-slate-400">—</td>
                    <td className="p-8 text-center text-teal-600 bg-teal-50/30 font-black">Monthly Surprises</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-800">
              Frequently <span className="text-[#00a2a4]">Asked Questions</span>
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm transition-all hover:border-[#00a2a4]"
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <span className="text-xs font-black uppercase tracking-widest text-slate-800">{faq.q}</span>
                  <div className={`h-8 w-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-transform ${activeFaq === index ? 'rotate-180 bg-[#00a2a4] text-white' : ''}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-50 bg-slate-50/30"
                    >
                      <div className="p-6 text-[11px] font-medium leading-relaxed text-slate-500 uppercase tracking-widest">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center rounded-[3rem] bg-gradient-to-br from-[#00a2a4] to-teal-800 p-12 sm:p-20 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-full opacity-10 pointer-events-none">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          </div>
          
          <Gift className="mx-auto mb-8 text-white/50" size={64} />
          <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter leading-tight">
            Start Your Premium <br />Wellness Journey Today
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-teal-100">
            Join the elite club of healthy individuals and save ₹1,000s monthly.
          </p>
          <button className="mt-12 rounded-2xl bg-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 shadow-2xl hover:scale-105 active:scale-95 transition-all">
            Join MediQuick+ Care Now
          </button>
        </section>

      </div>
    </div>
  );
};

export default CarePlanPage;
