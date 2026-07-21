import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  Crown, 
  Clock, 
  Truck, 
  CheckCircle2, 
  ChevronDown,
  Gift,
  Star,
  Sparkles,
  Loader2,
  Check,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCarePlans, getMySubscription, subscribeCarePlan } from '../api/carePlan';
import { getPageContent } from '../api/pageContent';
import ComingSoonHero from '../components/common/ComingSoonHero';
import { createRazorpayOrder, verifyRazorpayPayment } from '../api/checkout';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

const CarePlanPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [plans, setPlans] = useState([]);
  const [activeSub, setActiveSub] = useState(null);
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isYearly, setIsYearly] = useState(true);
  const [subscribingId, setSubscribingId] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [plansData, subData, contentData] = await Promise.all([
          getCarePlans(),
          token ? getMySubscription(token) : Promise.resolve(null),
          getPageContent('care-plan')
        ]);
        setPlans(plansData);
        setActiveSub(subData);
        setPageContent(contentData);
      } catch (err) {
        console.error('Failed to load care plans:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (!loading && pageContent?.status === 'ComingSoon') {
    return <ComingSoonHero title="MediQuick Care Plan" heroHeadline={pageContent.heroHeadline} heroSubtext={pageContent.heroSubtext} />;
  }

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleSubscribe = async (plan) => {
    if (!user) {
      toast.error('Please login to subscribe to Care Plan');
      return navigate('/login', { state: { from: '/care-plan' } });
    }

    setSubscribingId(plan._id);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setSubscribingId(null);
        return toast.error('Razorpay SDK failed to load. Are you online?');
      }

      const rzpOrder = await createRazorpayOrder(token, plan.price);

      const options = {
        key: rzpOrder.keyId,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency || 'INR',
        name: 'MediQuick Care Plan',
        description: `Subscription: ${plan.name}`,
        order_id: rzpOrder.razorpayOrderId,
        handler: async (response) => {
          try {
            await verifyRazorpayPayment(token, response);
            const created = await subscribeCarePlan(token, {
              planId: plan._id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id
            });
            setActiveSub(created);
            confetti({
              particleCount: 150,
              spread: 90,
              origin: { y: 0.5 },
              colors: ['#00a2a4', '#f59e0b', '#10b981', '#6366f1']
            });
            toast.success(`Welcome to ${plan.name}! Benefits are now active.`);
          } catch (err) {
            toast.error(err.message || 'Payment verification failed');
          } finally {
            setSubscribingId(null);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: { color: '#00a2a4' },
        modal: {
          ondismiss: () => {
            setSubscribingId(null);
            toast.error('Subscription purchase cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.message || 'Failed to initiate subscription payment');
      setSubscribingId(null);
    }
  };

  const perks = [
    {
      title: "Zero Delivery Fee",
      desc: "Unlimited free deliveries on all medicine & healthcare orders.",
      icon: Truck,
      color: "from-[#00a2a4] to-cyan-600"
    },
    {
      title: "Extra 5% - 10% Savings",
      desc: "Additional flat membership discount stacked on top of existing offers.",
      icon: Zap,
      color: "from-amber-500 to-orange-500"
    },
    {
      title: "Free Annual Lab Checkup",
      desc: "Includes 1 Free Complete Blood Count (CBC) test with annual tier.",
      icon: Gift,
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Priority Customer Support",
      desc: "Skip the queue with a dedicated healthcare concierge support manager.",
      icon: ShieldCheck,
      color: "from-indigo-500 to-purple-600"
    }
  ];

  const faqs = [
    { 
      q: "How does billing work?", 
      a: "Care Plan is billed as a 1-time upfront payment for your selected billing frequency (Monthly or Annual). Your benefits activate instantly upon payment completion." 
    },
    { 
      q: "Can I cancel my subscription anytime?", 
      a: "Yes! You can cancel your subscription at any time with 1 click from your profile under 'My Care Plan'. You will continue to enjoy your full benefits until the end of your billing cycle." 
    },
    { 
      q: "How does the Free Delivery benefit work at Checkout?", 
      a: "As long as your Care Plan subscription is active, the system will automatically waive the delivery fee on qualifying cart checkouts without needing a promo code." 
    },
    { 
      q: "Does the Care Plan discount stack with existing coupons?", 
      a: "Yes! Your extra membership discount automatically applies to your cart alongside site promotional coupons." 
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFD] pb-24 pt-4 sm:pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Compact Hero Section */}
        <section className="mb-8 overflow-hidden rounded-[24px] shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-slate-100 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(0,162,164,0.12)_0%,transparent_100%),linear-gradient(135deg,#071424_0%,#032c2d_100%)]" />
          
          <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <span className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00a2a4]/20 border border-[#00a2a4]/30 text-[9px] font-black uppercase tracking-[0.2em] text-[#00d4d6]">
                <Crown size={12} className="text-[#00d4d6]" /> Premium Membership
              </span>

              <h1 className="text-2xl sm:text-4xl font-normal tracking-tight text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
                MediQuick Care Plan
              </h1>

              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-300 max-w-md">
                Unlimited free delivery, extra medicine discounts, and priority healthcare support for you and your family.
              </p>
            </div>

            {/* Active Subscription Status Banner or CTA */}
            {activeSub ? (
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl max-w-sm text-white space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                  <CheckCircle2 size={16} />
                  <span>Care Plan Active</span>
                </div>
                <p className="text-xs text-slate-200">
                  You are currently subscribed to <span className="font-bold text-white">{activeSub.planName}</span>.
                </p>
                <p className="text-[11px] text-slate-400">
                  Renews on: <span className="font-mono text-slate-200 font-bold">{new Date(activeSub.renewalDate).toLocaleDateString()}</span>
                </p>
                <button
                  onClick={() => navigate('/profile?tab=care-plan')}
                  className="w-full mt-2 py-2 bg-white text-slate-900 rounded-full text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Manage Subscription
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('pricing-tiers');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-[#00a2a4] hover:bg-[#008f91] text-white text-xs font-bold rounded-full shadow-lg shadow-[#00a2a4]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Explore Membership Tiers</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Real Plan Benefits Section */}
        <section className="mb-12">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#00a2a4] mb-1">Member Privileges</h2>
            <p className="text-xl font-bold text-slate-900 tracking-tight">Real savings on every order</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {perks.map((perk, idx) => {
              const Icon = perk.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${perk.color} flex items-center justify-center text-white mb-4 shadow-md`}>
                      <Icon size={22} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5">{perk.title}</h3>
                    <p className="text-xs text-slate-500 font-normal leading-relaxed">{perk.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-[#00a2a4]">
                    <CheckCircle2 size={13} /> Enforced at Checkout
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Plan Tiers Section */}
        <section id="pricing-tiers" className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 mb-1">Choose Your Tier</h2>
            <p className="text-xl font-bold text-slate-900 tracking-tight mb-4">Transparent subscription pricing</p>

            {/* Monthly / Annual Toggle */}
            <div className="inline-flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  !isYearly ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isYearly ? 'bg-[#00a2a4] text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                <span>Annual Billing</span>
                <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Save 58%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Monthly Card */}
            <div className={`bg-white border rounded-[32px] p-8 transition-all relative flex flex-col justify-between ${
              !isYearly ? 'border-slate-300 shadow-lg' : 'border-slate-200/60 opacity-90'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Tier</span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">Flexible</span>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-slate-900">₹199</span>
                  <span className="text-xs text-slate-400 font-semibold"> / month</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-600 mb-8">
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#00a2a4]" />
                    <span>Free Delivery on orders over ₹199</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#00a2a4]" />
                    <span>Extra 5% discount on all medicines</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#00a2a4]" />
                    <span>Priority customer care & chat support</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  const p = plans.find(pl => pl.tier === 'monthly');
                  if (p) handleSubscribe(p);
                }}
                disabled={subscribingId !== null || activeSub?.tier === 'monthly'}
                className="w-full py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
              >
                {activeSub?.tier === 'monthly' ? (
                  <span>Current Active Plan</span>
                ) : subscribingId === plans.find(pl => pl.tier === 'monthly')?._id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <span>Choose Monthly Plan</span>
                )}
              </button>
            </div>

            {/* Annual Card */}
            <div className={`bg-white border rounded-[32px] p-8 transition-all relative flex flex-col justify-between ${
              isYearly ? 'border-[#00a2a4] ring-2 ring-[#00a2a4]/20 shadow-xl' : 'border-slate-200/60'
            }`}>
              <div className="absolute -top-3.5 right-6 bg-[#00a2a4] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                Best Value Tier
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00a2a4]">Annual Tier</span>
                  <span className="text-[10px] font-bold bg-[#00a2a4]/10 text-[#00a2a4] px-2.5 py-1 rounded-full">12 Months</span>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-slate-900">₹999</span>
                  <span className="text-xs text-slate-400 font-semibold"> / year</span>
                  <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">Equivalent to ₹83/month</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-600 mb-8">
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-emerald-500 font-bold" />
                    <span className="font-bold text-slate-800">Free Delivery on ALL orders (No min order)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-emerald-500 font-bold" />
                    <span className="font-bold text-slate-800">Extra 10% discount on all medicines</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-emerald-500 font-bold" />
                    <span>1 Free Annual Complete Blood Count (CBC) test</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-emerald-500 font-bold" />
                    <span>Dedicated healthcare concierge support</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  const p = plans.find(pl => pl.tier === 'annual');
                  if (p) handleSubscribe(p);
                }}
                disabled={subscribingId !== null || activeSub?.tier === 'annual'}
                className="w-full py-3.5 rounded-full bg-slate-900 hover:bg-[#00a2a4] text-white text-xs font-bold transition-all cursor-pointer shadow-lg active:scale-98 flex items-center justify-center gap-2"
              >
                {activeSub?.tier === 'annual' ? (
                  <span>Current Active Plan</span>
                ) : subscribingId === plans.find(pl => pl.tier === 'annual')?._id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <span>Subscribe Annual Plan</span>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-16 bg-white border border-slate-200/60 rounded-[32px] p-8 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 text-center mb-8">How MediQuick Care Plan Works</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 font-bold flex items-center justify-center mx-auto text-sm">1</div>
              <h4 className="text-xs font-bold text-slate-800">Select Membership Tier</h4>
              <p className="text-[11px] text-slate-400">Choose between flexible monthly or discounted annual membership.</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#00a2a4]/10 text-[#00a2a4] font-bold flex items-center justify-center mx-auto text-sm">2</div>
              <h4 className="text-xs font-bold text-slate-800">Instant Benefits at Checkout</h4>
              <p className="text-[11px] text-slate-400">Zero delivery fee and member discounts automatically apply to every cart.</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 font-bold flex items-center justify-center mx-auto text-sm">3</div>
              <h4 className="text-xs font-bold text-slate-800">1-Click Transparent Control</h4>
              <p className="text-[11px] text-slate-400">Manage billing or cancel anytime with 1 click from your user profile.</p>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="max-w-2xl mx-auto">
          <h3 className="text-base font-bold text-slate-900 text-center mb-6">Frequently Asked Questions</h3>
          
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-xs">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={16} className={`transition-transform text-slate-400 ${activeFaq === idx ? 'rotate-180 text-[#00a2a4]' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default CarePlanPage;
