import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  User, 
  Star, 
  Clock, 
  Stethoscope, 
  Video, 
  MessageSquare, 
  Phone, 
  ChevronRight,
  ShieldCheck,
  Award,
  Sparkles,
  SlidersHorizontal,
  CheckCircle,
  Heart,
  Baby
} from 'lucide-react';
import { getDoctors } from '../api/doctors';
import { getPageContent } from '../api/pageContent';
import ComingSoonHero from '../components/common/ComingSoonHero';

const ConsultPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpecialization, setActiveSpecialization] = useState('All');

  const specializations = [
    { name: 'All', icon: Stethoscope, label: 'All Doctors' },
    { name: 'General Physician', icon: User, label: 'General Physician' },
    { name: 'Dermatologist', icon: Sparkles, label: 'Skin & Hair (Dermatology)' },
    { name: 'Pediatrician', icon: Baby, label: 'Child Specialist (Pediatrician)' },
    { name: 'Gynecologist', icon: Heart, label: "Women's Health (Gynecologist)" }
  ];

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const [docsData, contentData] = await Promise.all([
          getDoctors({
            specialization: activeSpecialization,
            search: searchQuery
          }),
          getPageContent('consult')
        ]);
        setDoctors(docsData);
        setPageContent(contentData);
      } catch (err) {
        console.error('Failed to load doctors catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [activeSpecialization, searchQuery]);

  if (!loading && pageContent?.status === 'ComingSoon') {
    return <ComingSoonHero title="Doctor Consultations" heroHeadline={pageContent.heroHeadline} heroSubtext={pageContent.heroSubtext} />;
  }

  return (
    <div className="min-h-screen bg-[#FAFBFD] pb-24 pt-4 sm:pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Compact Hero banner */}
        <section className="mb-8 overflow-hidden rounded-[24px] shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-slate-100 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(0,162,164,0.1)_0%,transparent_100%),linear-gradient(135deg,#0c192c_0%,#053638_100%)]" />
          
          <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <span className="mb-2 inline-block text-[9px] font-black uppercase tracking-[0.2em] text-[#00d4d6]">
                TELEMEDICINE CONSULTATIONS
              </span>
              <h1 className="text-2xl sm:text-4xl font-normal tracking-tight text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
                Talk to certified doctors <br />from home.
              </h1>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-300 max-w-md">
                Connect with verified medical specialists via HD video, audio, or instant chat. Get digital prescriptions & medical advice.
              </p>
            </div>

            {/* Interactive Hero Search */}
            <div className="w-full md:w-80 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="text"
                  placeholder="Search physician, dermatologist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200/50 pl-10 pr-4 py-2.5 rounded-full text-xs outline-none focus:border-[#00a2a4] transition-all text-slate-800"
                />
              </div>
              <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-300 font-semibold px-1">
                <ShieldCheck size={12} className="text-[#00d4d6]" />
                <span>Verified Practitioners Only</span>
              </div>
            </div>
          </div>
        </section>

        {/* Specialization Filter Tiles */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 mb-4">Browse by Specialization</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {specializations.map((spec) => {
              const Icon = spec.icon;
              const isSelected = activeSpecialization === spec.name;
              return (
                <button
                  key={spec.name}
                  onClick={() => setActiveSpecialization(spec.name)}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[#00a2a4] border-[#00a2a4] text-white shadow-md shadow-[#00a2a4]/20'
                      : 'bg-white border-slate-200/60 text-slate-700 hover:border-[#00a2a4]/40 hover:bg-[#FAFBFD]'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#00a2a4]/10 text-[#00a2a4]'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-xs font-bold leading-tight">{spec.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Doctor Grid Section */}
        <section>
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200/60">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Available Doctors</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Showing <span className="font-bold text-slate-700">{doctors.length}</span> verified practitioners
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-3xl h-56 p-6 flex gap-4">
                  <div className="w-24 h-24 bg-slate-100 rounded-2xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-40 bg-slate-100 rounded" />
                    <div className="h-3 w-24 bg-slate-100 rounded" />
                    <div className="h-4 w-32 bg-slate-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctors.map(doc => (
                <div 
                  key={doc._id}
                  className="bg-white border border-slate-200/60 rounded-[28px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:border-[#00a2a4]/40 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img 
                      src={doc.photo || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80"} 
                      alt={doc.name}
                      className="w-24 h-24 rounded-2xl object-cover border border-slate-100 shadow-xs flex-shrink-0 bg-slate-50"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#00a2a4]/10 text-[#00a2a4] text-[9px] font-black uppercase tracking-wider">
                          {doc.specialization}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                          {doc.rating} ({doc.numReviews})
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 tracking-tight truncate">{doc.name}</h4>
                      <p className="text-xs font-medium text-slate-500 mb-2">{doc.qualifications}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-600">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Award size={13} className="text-[#00a2a4]" />
                          {doc.experienceYears} Yrs Experience
                        </span>
                        <span>•</span>
                        <span className="text-slate-500">
                          Reg: <span className="font-mono text-slate-700 font-bold">{doc.registrationNumber || 'Verified'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    "{doc.bio}"
                  </p>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Consultation Fee</span>
                      <span className="text-lg font-bold text-slate-900">₹{doc.consultationFee}</span>
                    </div>

                    <button
                      onClick={() => navigate(`/consult-doctor/${doc._id}`)}
                      className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-[#00a2a4] text-white text-xs font-bold transition-all cursor-pointer shadow-md active:scale-98 flex items-center gap-1.5"
                    >
                      <span>Book Consultation</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center my-6">
              <Stethoscope size={40} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-base font-bold text-slate-800 mb-1">No Doctors Found</h3>
              <p className="text-xs text-slate-400 mb-6">Try selecting a different specialization or adjusting your search.</p>
              <button
                onClick={() => { setActiveSpecialization('All'); setSearchQuery(''); }}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default ConsultPage;
