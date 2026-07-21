import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Clock, 
  Droplet, 
  Info, 
  ShieldCheck, 
  Calendar, 
  Activity, 
  AlertCircle
} from 'lucide-react';
import { getLabTestDetails } from '../../api/labTests';

const LabTestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await getLabTestDetails(id);
        setTest(data);
      } catch (err) {
        console.error('Failed to load test details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBFD] flex items-center justify-center pt-20">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-48 bg-slate-100 rounded" />
          <div className="h-4 w-32 bg-slate-100 rounded" />
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-[#FAFBFD] flex flex-col items-center justify-center pt-20 text-center px-4">
        <AlertCircle size={40} className="text-slate-300 mb-4" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Package not found</h3>
        <button 
          onClick={() => navigate('/lab-tests')}
          className="mt-6 rounded-full border border-slate-200 px-6 py-2 text-xs font-bold text-slate-700 hover:border-slate-800 transition-all"
        >
          Back to Lab Tests
        </button>
      </div>
    );
  }

  const hasDiscount = !!test.discountedPrice && test.discountedPrice < test.price;
  const finalPrice = hasDiscount ? test.discountedPrice : test.price;
  const discountPercent = hasDiscount ? Math.round(((test.price - test.discountedPrice) / test.price) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#FAFBFD] pb-24 pt-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <button 
          onClick={() => navigate('/lab-tests')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-850 mb-8 transition-colors"
        >
          <ChevronLeft size={14} />
          <span>Back to Lab Catalog</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#00a2a4] bg-[#00a2a4]/5 px-2.5 py-0.5 rounded-full">
                  {test.category}
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-100/50">
                  <ShieldCheck size={10} /> Certified Lab Partner
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug mb-3">
                {test.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {test.description}
              </p>

              {/* Biomarkers details */}
              {test.parameters && test.parameters.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                    Biomarker Parameters Included ({test.parameters.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {test.parameters.map((param, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <Activity size={12} className="text-[#00a2a4]" />
                        <span className="text-xs font-bold text-slate-700">{param}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Medical guidance details */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Sample Prep & Collection Guidance
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Preparation Notes</h4>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                    {test.prepInstructions || 'No special instructions required prior to collection.'}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Sample Collection Type</h4>
                  <p className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
                    <Droplet size={13} className="text-[#00a2a4]" /> {test.sampleType} Sample Required
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 p-4 bg-amber-50/50 border border-amber-100/50 rounded-2xl">
                <Info size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800 leading-relaxed font-semibold">
                  Accurate clinical readings rely strictly on matching preparation directions. Please follow standard fasting times where marked.
                </p>
              </div>
            </div>
          </div>

          {/* Action sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-xs sticky top-28">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Pricing & Booking</h3>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">₹{finalPrice}</span>
                  {hasDiscount && (
                    <span className="text-sm text-slate-400 line-through">₹{test.price}</span>
                  )}
                </div>
                {hasDiscount && (
                  <span className="text-[10px] font-black uppercase text-[#00a2a4] tracking-wider mt-1 block">
                    Save {discountPercent}% on this profile
                  </span>
                )}
              </div>

              {/* Spec bullets */}
              <div className="space-y-3.5 mb-6 border-t border-b border-slate-100 py-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Turnaround Time</span>
                  <span className="text-slate-700 font-bold flex items-center gap-1">
                    <Clock size={12} /> Reports in {test.turnaroundHours} hours
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Sample Type</span>
                  <span className="text-slate-700 font-bold">{test.sampleType}</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/lab-tests/${test._id}/book`)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-slate-900 border border-transparent text-xs font-bold text-white hover:bg-slate-800 transition-all cursor-pointer shadow-lg shadow-slate-900/10 active:scale-98"
              >
                <Calendar size={13} />
                <span>Book Home Collection</span>
              </button>

              <p className="text-[10px] text-center text-slate-400 mt-3 font-semibold">
                Free rescheduling up to 4 hours prior
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabTestDetail;
