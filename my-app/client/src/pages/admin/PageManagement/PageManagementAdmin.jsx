import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Eye, 
  Save, 
  CheckSquare, 
  Square, 
  AlertCircle, 
  History, 
  ShieldCheck, 
  Sparkles, 
  Stethoscope, 
  Crown, 
  Leaf, 
  Loader2,
  CheckCircle,
  ExternalLink,
  Plus,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getAllPageContentsAdmin, updatePageContentAdmin } from '../../../api/pageContent';
import { getAdminDoctors, addDoctorAdmin } from '../../../api/doctors';
import { API_BASE } from '../../../utils/apiConfig';
import toast from 'react-hot-toast';

const PageManagementAdmin = () => {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState('lab-tests');
  const [pagesData, setPagesData] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states per page
  const [currentContent, setCurrentContent] = useState({
    heroHeadline: '',
    heroSubtext: '',
    status: 'Live',
    themeAccent: '#4A6B49',
    trustClaims: [],
    faqs: [],
    aboutBlock: '',
    auditLog: []
  });

  const pageMeta = {
    'lab-tests': { label: 'Lab Tests', route: '/lab-tests', icon: Stethoscope },
    'ayurveda': { label: 'Ayurveda', route: '/ayurveda', icon: Leaf },
    'consult': { label: 'Consult Doctors', route: '/consult', icon: Stethoscope },
    'care-plan': { label: 'Care Plan', route: '/care-plan', icon: Crown }
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const activeToken = token || localStorage.getItem('userToken');
      const [contents, docs] = await Promise.all([
        getAllPageContentsAdmin(activeToken),
        getAdminDoctors(activeToken)
      ]);
      
      const contentMap = {};
      contents.forEach(c => {
        contentMap[c.pageKey] = c;
      });
      setPagesData(contentMap);
      setDoctors(docs);

      if (contentMap[activeTab]) {
        setCurrentContent(contentMap[activeTab]);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load page configurations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [token]);

  useEffect(() => {
    if (pagesData[activeTab]) {
      setCurrentContent(pagesData[activeTab]);
    } else {
      setCurrentContent({
        heroHeadline: '',
        heroSubtext: '',
        status: 'Live',
        themeAccent: '#4A6B49',
        trustClaims: [],
        faqs: [],
        aboutBlock: '',
        auditLog: []
      });
    }
  }, [activeTab, pagesData]);

  const handleSavePage = async (e) => {
    e.preventDefault();
    
    // Validation: Check unconfirmed trust claims for lab-tests
    if (activeTab === 'lab-tests' && currentContent.trustClaims) {
      const unconfirmed = currentContent.trustClaims.some(tc => !tc.confirmedAccurate);
      if (unconfirmed) {
        toast.error('All trust claims must be explicitly confirmed as accurate before saving live!');
        return;
      }
    }

    setSaving(true);
    try {
      const activeToken = token || localStorage.getItem('userToken');
      const updated = await updatePageContentAdmin(activeToken, activeTab, currentContent);
      setPagesData(prev => ({ ...prev, [activeTab]: updated }));
      toast.success(`${pageMeta[activeTab].label} settings saved live!`);
    } catch (err) {
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleDoctorVerification = async (docId, currentVerified) => {
    try {
      const activeToken = token || localStorage.getItem('userToken');
      const res = await fetch(`${API_BASE}/api/doctors/admin/edit/${docId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`
        },
        body: JSON.stringify({ isVerified: !currentVerified })
      });
      if (!res.ok) throw new Error('Failed to update doctor verification');
      toast.success(`Doctor status set to ${!currentVerified ? 'Verified' : 'Unverified'}`);
      fetchAll();
    } catch (err) {
      toast.error(err.message || 'Error updating doctor verification');
    }
  };

  const addTrustClaim = () => {
    setCurrentContent(prev => ({
      ...prev,
      trustClaims: [...(prev.trustClaims || []), { text: '', confirmedAccurate: false }]
    }));
  };

  const removeTrustClaim = (idx) => {
    setCurrentContent(prev => ({
      ...prev,
      trustClaims: prev.trustClaims.filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/70 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layout className="text-[#00a2a4]" size={22} />
            Page Content & Trust Management
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">Manage headlines, page statuses, trust claims, and doctor verifications</p>
        </div>

        {/* Live Preview Button */}
        <a
          href={pageMeta[activeTab].route}
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-full transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Eye size={16} className="text-[#00a2a4]" />
          <span>Preview Live Route ({pageMeta[activeTab].route})</span>
          <ExternalLink size={13} className="text-slate-400" />
        </a>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200/80 pb-3 overflow-x-auto">
        {Object.keys(pageMeta).map(key => {
          const item = pageMeta[key];
          const Icon = item.icon;
          const isSelected = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 flex-shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white border border-slate-200/70 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={16} className={isSelected ? 'text-[#00d4d6]' : 'text-slate-400'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center animate-pulse">
          <Loader2 size={32} className="mx-auto text-[#00a2a4] animate-spin mb-3" />
          <p className="text-xs text-slate-400 font-semibold">Loading page configurations...</p>
        </div>
      ) : (
        <form onSubmit={handleSavePage} className="space-y-6">
          
          {/* SECTION 1: Page Status & Hero Copy */}
          <div className="bg-white border border-slate-200/70 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Hero Section & Page Status</h2>
              
              {/* Status Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Page Status:</span>
                <select
                  value={currentContent.status || 'Live'}
                  onChange={(e) => setCurrentContent({ ...currentContent, status: e.target.value })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border outline-none ${
                    currentContent.status === 'Live' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    currentContent.status === 'ComingSoon' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  <option value="Live">Live (Full Experience)</option>
                  <option value="ComingSoon">Coming Soon (Waitlist Mode)</option>
                  <option value="Hidden">Hidden (Route Offline)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Hero Headline</label>
              <input
                type="text"
                required
                value={currentContent.heroHeadline || ''}
                onChange={(e) => setCurrentContent({ ...currentContent, heroHeadline: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00a2a4]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Hero Subtext</label>
              <textarea
                rows="2"
                required
                value={currentContent.heroSubtext || ''}
                onChange={(e) => setCurrentContent({ ...currentContent, heroSubtext: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00a2a4]"
              />
            </div>
          </div>

          {/* TAB SPECIFIC SETTINGS */}

          {/* 1. LAB TESTS TAB */}
          {activeTab === 'lab-tests' && (
            <div className="bg-white border border-slate-200/70 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Trust Claims Verification Gate</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Every claim requires explicit confirmation before going live</p>
                </div>

                <button
                  type="button"
                  onClick={addTrustClaim}
                  className="px-3.5 py-1.5 bg-[#00a2a4]/10 text-[#00a2a4] hover:bg-[#00a2a4]/20 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Add Claim
                </button>
              </div>

              <div className="space-y-3">
                {currentContent.trustClaims && currentContent.trustClaims.map((claim, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <input
                      type="text"
                      placeholder="Trust claim text..."
                      value={claim.text}
                      onChange={(e) => {
                        const updated = [...currentContent.trustClaims];
                        updated[idx].text = e.target.value;
                        setCurrentContent({ ...currentContent, trustClaims: updated });
                      }}
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                    />

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <input
                        type="checkbox"
                        checked={claim.confirmedAccurate}
                        onChange={(e) => {
                          const updated = [...currentContent.trustClaims];
                          updated[idx].confirmedAccurate = e.target.checked;
                          setCurrentContent({ ...currentContent, trustClaims: updated });
                        }}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <span>Confirmed Accurate</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => removeTrustClaim(idx)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. AYURVEDA TAB */}
          {activeTab === 'ayurveda' && (
            <div className="bg-white border border-slate-200/70 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Ayurveda Theme & Educational Content</h3>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Theme Accent Color (Hex)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={currentContent.themeAccent || '#4A6B49'}
                    onChange={(e) => setCurrentContent({ ...currentContent, themeAccent: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={currentContent.themeAccent || '#4A6B49'}
                    onChange={(e) => setCurrentContent({ ...currentContent, themeAccent: e.target.value })}
                    className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Educational Text Block</label>
                <textarea
                  rows="4"
                  value={currentContent.aboutBlock || ''}
                  onChange={(e) => setCurrentContent({ ...currentContent, aboutBlock: e.target.value })}
                  placeholder="Authoritative, real educational copy about Ayurveda..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>
            </div>
          )}

          {/* 3. CONSULT DOCTORS TAB */}
          {activeTab === 'consult' && (
            <div className="bg-white border border-slate-200/70 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Doctor Verification Management</h3>
              <p className="text-xs text-slate-400 font-medium">Unverified doctors are automatically excluded from the public `/consult` page</p>

              <div className="space-y-3">
                {doctors.map(doc => (
                  <div key={doc._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <img src={doc.photo} alt={doc.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{doc.name}</span>
                        <span className="text-[11px] text-slate-500">{doc.specialization} ({doc.qualifications})</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleDoctorVerification(doc._id, doc.isVerified)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        doc.isVerified
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                    >
                      <ShieldCheck size={14} />
                      <span>{doc.isVerified ? 'Verified (Live)' : 'Unverified (Hidden)'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. CARE PLAN TAB */}
          {activeTab === 'care-plan' && (
            <div className="bg-white border border-slate-200/70 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Linked Benefit Rules Verification</h3>
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">1. Free Delivery Benefit</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-[10px]">
                    Linked Rule: FREE_DELIVERY
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">2. Extra Medicine Discount</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-[10px]">
                    Linked Rule: EXTRA_DISCOUNT
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Audit History Log */}
          {currentContent.auditLog && currentContent.auditLog.length > 0 && (
            <div className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-xs">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <History size={14} className="text-[#00a2a4]" /> Change History Log
              </h4>

              <div className="space-y-2 max-h-36 overflow-y-auto">
                {currentContent.auditLog.slice().reverse().map((log, idx) => (
                  <div key={idx} className="text-[11px] text-slate-500 flex justify-between border-b border-slate-100 pb-1.5">
                    <span>{log.action} by <span className="font-bold text-slate-800">{log.updatedBy}</span></span>
                    <span className="font-mono text-slate-400">{new Date(log.updatedAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save Action Bar */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-slate-900 hover:bg-[#00a2a4] text-white rounded-full text-xs font-bold transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>Save Live Changes to {pageMeta[activeTab].label}</span>
          </button>

        </form>
      )}

    </div>
  );
};

export default PageManagementAdmin;
