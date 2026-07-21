import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Award, 
  Star, 
  Loader2,
  X,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getAdminDoctors, addDoctorAdmin, deleteDoctorAdmin } from '../../../api/doctors';
import toast from 'react-hot-toast';

const DoctorsAdmin = () => {
  const { token } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    qualifications: '',
    specialization: 'General Physician',
    experienceYears: 5,
    bio: '',
    languagesSpoken: 'English, Hindi',
    consultationFee: 499,
    registrationNumber: ''
  });

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const activeToken = token || localStorage.getItem('userToken');
      const data = await getAdminDoctors(activeToken);
      setDoctors(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load doctors list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [token]);

  const handleDeleteDoctor = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return;
    }
    try {
      const activeToken = token || localStorage.getItem('userToken');
      await deleteDoctorAdmin(activeToken, id);
      toast.success(`${name} deleted successfully!`);
      fetchDoctors();
    } catch (err) {
      toast.error(err.message || 'Failed to delete doctor');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const activeToken = token || localStorage.getItem('userToken');
      const payload = {
        ...formData,
        experienceYears: Number(formData.experienceYears),
        consultationFee: Number(formData.consultationFee),
        languagesSpoken: formData.languagesSpoken.split(',').map(s => s.trim())
      };
      await addDoctorAdmin(activeToken, payload);
      toast.success('Doctor profile created successfully!');
      setShowModal(false);
      fetchDoctors();
      setFormData({
        name: '',
        photo: '',
        qualifications: '',
        specialization: 'General Physician',
        experienceYears: 5,
        bio: '',
        languagesSpoken: 'English, Hindi',
        consultationFee: 499,
        registrationNumber: ''
      });
    } catch (err) {
      toast.error(err.message || 'Failed to add doctor');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.qualifications.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/70 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Stethoscope className="text-[#00a2a4]" size={22} />
            Doctor Practitioners Catalog
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">Manage verified telemedicine doctors, qualifications, and consultation fees</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-slate-900 hover:bg-[#00a2a4] text-white text-xs font-bold rounded-full transition-all cursor-pointer shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <UserPlus size={16} />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, specialization or qualifications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#00a2a4] shadow-xs"
        />
      </div>

      {/* Doctors Table / Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-white border border-slate-100 rounded-3xl p-6" />
          ))}
        </div>
      ) : filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doc => (
            <div key={doc._id} className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src={doc.photo || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80"} 
                    alt={doc.name} 
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-100 bg-slate-50 flex-shrink-0"
                  />
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#00a2a4]/10 text-[#00a2a4] text-[9px] font-black uppercase tracking-wider inline-block mb-1">
                      {doc.specialization}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{doc.name}</h3>
                    <p className="text-xs font-medium text-slate-500">{doc.qualifications}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{doc.experienceYears} Yrs Exp • Reg: <span className="font-mono text-slate-700 font-bold">{doc.registrationNumber || 'N/A'}</span></p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                  "{doc.bio}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Consultation Fee</span>
                  <p className="text-base font-bold text-slate-900">₹{doc.consultationFee}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <CheckCircle size={12} /> Verified
                  </span>
                  <button
                    onClick={() => handleDeleteDoctor(doc._id, doc.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                    title="Delete Doctor"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center">
          <Stethoscope size={36} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Doctors Added Yet</h3>
          <p className="text-xs text-slate-400 mt-1">Click 'Add New Doctor' above to onboard verified medical practitioners.</p>
        </div>
      )}

      {/* Add Doctor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Add Doctor Profile</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Doctor Name</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Specialization</label>
                  <select
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="General Physician">General Physician</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Cardiologist">Cardiologist</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Qualifications</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MBBS, MD (Dermatology)"
                  value={formData.qualifications}
                  onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Registration No.</label>
                  <input
                    type="text"
                    placeholder="MCI-XXXXX"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Photo URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Bio / Profile Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief practitioner summary..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-slate-900 hover:bg-[#00a2a4] text-white rounded-full font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <span>Save Doctor Profile</span>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsAdmin;
