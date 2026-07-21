import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Loader2, 
  Calendar,
  XCircle,
  Truck,
  Zap,
  Gift
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getMySubscription, cancelCarePlanSubscription } from '../../../api/carePlan';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyCarePlanTab = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchSub = async () => {
    setLoading(true);
    try {
      const activeToken = token || localStorage.getItem('userToken');
      const data = await getMySubscription(activeToken);
      setSubscription(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSub();
  }, [token]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your Care Plan subscription? You will lose free delivery and extra discounts upon billing expiration.')) {
      return;
    }

    setCancelling(true);
    try {
      const activeToken = token || localStorage.getItem('userToken');
      await cancelCarePlanSubscription(activeToken);
      toast.success('Subscription cancelled');
      fetchSub();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel subscription');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-40 bg-white border border-slate-100 rounded-3xl p-6" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Crown size={18} className="text-[#00a2a4]" />
            My Care Plan Membership
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Manage your active subscription, renewal dates, and member perks</p>
        </div>
      </div>

      {subscription && subscription.status === 'Active' ? (
        <div className="bg-white border border-slate-200/70 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#00a2a4]/5 border border-[#00a2a4]/20 p-5 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#00a2a4] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Crown size={24} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#00a2a4]">Active Membership</span>
                <h3 className="text-base font-bold text-slate-900">{subscription.planName}</h3>
                <p className="text-xs text-slate-500 font-medium">Billed upfront via {subscription.paymentMethod}</p>
              </div>
            </div>

            <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold self-start sm:self-auto flex items-center gap-1.5">
              <CheckCircle2 size={13} /> Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 font-semibold block mb-1">Start Date</span>
              <span className="text-sm font-bold text-slate-800">
                {new Date(subscription.startDate).toLocaleDateString()}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 font-semibold block mb-1">Renewal / Expiration Date</span>
              <span className="text-sm font-bold text-slate-800">
                {new Date(subscription.renewalDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Enforced Active Benefits</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
                <Truck size={16} className="text-[#00a2a4]" />
                <span>Zero Delivery Fee at Checkout</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
                <Zap size={16} className="text-amber-500" />
                <span>Extra {subscription.tier === 'annual' ? '10%' : '5%'} Medicine Discount</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
                <ShieldCheck size={16} className="text-indigo-500" />
                <span>Priority Healthcare Concierge Support</span>
              </div>
              {subscription.tier === 'annual' && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
                  <Gift size={16} className="text-emerald-500" />
                  <span>1 Free Annual CBC Lab Checkup</span>
                </div>
              )}
            </div>
          </div>

          {/* 1-Click Cancel button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[11px] text-slate-400">Cancel anytime with zero cancellation fees.</p>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="px-4 py-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              {cancelling ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={14} />}
              <span>Cancel Subscription</span>
            </button>
          </div>

        </div>
      ) : (
        <div className="bg-white border border-slate-200/60 rounded-3xl p-10 text-center">
          <Crown size={36} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No Active Care Plan Subscription</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">Subscribe to Care Plan to get zero delivery fee on orders and extra discounts on medicines.</p>
          <button
            onClick={() => navigate('/care-plan')}
            className="px-6 py-2.5 bg-slate-900 hover:bg-[#00a2a4] text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            Explore Care Plans
          </button>
        </div>
      )}

    </div>
  );
};

export default MyCarePlanTab;
