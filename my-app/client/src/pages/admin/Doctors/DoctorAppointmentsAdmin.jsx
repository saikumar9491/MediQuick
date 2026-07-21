import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search, 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Video, 
  Loader2,
  Stethoscope,
  X
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getAdminAppointments, updateAppointmentAdmin } from '../../../api/doctors';
import { API_BASE } from '../../../utils/apiConfig';
import toast from 'react-hot-toast';

const DoctorAppointmentsAdmin = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // E-Prescription Upload Modal
  const [uploadModalApt, setUploadModalApt] = useState(null);
  const [rxFile, setRxFile] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('Completed');
  const [updating, setUpdating] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const activeToken = token || localStorage.getItem('userToken');
      const data = await getAdminAppointments(activeToken);
      setAppointments(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load appointments dispatch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [token]);

  const handlePrescriptionUpload = async (e) => {
    e.preventDefault();
    if (!uploadModalApt) return;
    setUpdating(true);
    try {
      const activeToken = token || localStorage.getItem('userToken');
      const formData = new FormData();
      formData.append('status', statusUpdate);
      if (rxFile) {
        formData.append('prescription', rxFile);
      }

      await updateAppointmentAdmin(activeToken, uploadModalApt._id, formData);
      toast.success('Appointment status & prescription updated successfully!');
      setUploadModalApt(null);
      setRxFile(null);
      fetchAppointments();
    } catch (err) {
      toast.error(err.message || 'Failed to update appointment');
    } finally {
      setUpdating(false);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const docName = apt.doctorId?.name || '';
    const patName = apt.patientName || '';
    const matchesSearch = docName.toLowerCase().includes(searchQuery.toLowerCase()) || patName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || apt.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/70 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="text-[#00a2a4]" size={22} />
            Doctor Appointments Dispatch
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">Manage scheduled telemedicine consultations and upload E-Prescriptions</p>
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Scheduled', 'Completed', 'Cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === st ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by doctor name or patient name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#00a2a4] shadow-xs"
        />
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-36 bg-white border border-slate-100 rounded-3xl p-6" />
          ))}
        </div>
      ) : filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments.map(apt => (
            <div key={apt._id} className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Patient: {apt.patientName} ({apt.patientAge} yrs, {apt.patientGender})</span>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    apt.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    apt.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {apt.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium">
                  Doctor: <span className="font-bold text-slate-800">{apt.doctorId?.name || 'Doctor'}</span> ({apt.doctorId?.specialization})
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium pt-1">
                  <span>📅 {apt.scheduledDate}</span>
                  <span>•</span>
                  <span>⏰ {apt.scheduledTimeSlot}</span>
                  <span>•</span>
                  <span className="capitalize text-[#00a2a4] font-bold">{apt.mode} Mode</span>
                </div>

                {apt.symptomNotes && (
                  <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-2">
                    Symptoms: "{apt.symptomNotes}"
                  </p>
                )}
              </div>

              <div className="flex flex-col md:items-end gap-2.5 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <span className="text-xs font-bold text-slate-900">
                  Payment: <span className="text-emerald-600 font-extrabold">{apt.paymentStatus}</span> ({apt.paymentMethod})
                </span>

                <div className="flex items-center gap-2">
                  {apt.prescriptionFileUrl ? (
                    <a
                      href={`${API_BASE}${apt.prescriptionFileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5"
                    >
                      <FileText size={13} />
                      <span>View RX</span>
                    </a>
                  ) : null}

                  <button
                    onClick={() => {
                      setUploadModalApt(apt);
                      setStatusUpdate(apt.status);
                    }}
                    className="px-4 py-2 rounded-full bg-slate-900 hover:bg-[#00a2a4] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload size={13} />
                    <span>Update / Upload RX</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center">
          <Calendar size={36} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Appointments Found</h3>
          <p className="text-xs text-slate-400 mt-1">Patient appointment bookings will appear here.</p>
        </div>
      )}

      {/* Upload E-Prescription Modal */}
      {uploadModalApt && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Manage Consultation Record</h2>
              <button onClick={() => setUploadModalApt(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePrescriptionUpload} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Update Status</label>
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Upload E-Prescription (PDF/Image)</label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => setRxFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#00a2a4]/10 file:text-[#00a2a4] hover:file:bg-[#00a2a4]/20 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-3 bg-slate-900 hover:bg-[#00a2a4] text-white rounded-full font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {updating ? <Loader2 size={14} className="animate-spin" /> : <span>Save Consultation Record</span>}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorAppointmentsAdmin;
