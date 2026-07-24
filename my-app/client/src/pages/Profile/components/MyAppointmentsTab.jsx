import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  MessageSquare, 
  Phone, 
  FileText, 
  User, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Award,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getMyAppointments, cancelDoctorAppointment } from '../../../api/doctors';
import { API_BASE } from '../../../utils/apiConfig';
import toast from 'react-hot-toast';

const MyAppointmentsTab = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchAppointments = async () => {
    const activeToken = token || localStorage.getItem('userToken');
    if (!activeToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getMyAppointments(activeToken);
      setAppointments(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [token]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this consultation appointment?')) return;
    setCancellingId(id);
    try {
      const activeToken = token || localStorage.getItem('userToken');
      await cancelDoctorAppointment(activeToken, id);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel appointment');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2].map(i => (
          <div key={i} className="h-40 bg-white rounded-3xl border border-slate-100 p-6" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-800 tracking-tight">My Doctor Consultations</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Track upcoming appointments, join sessions, and download E-Prescriptions</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
          {appointments.length} Total
        </span>
      </div>

      {appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map(apt => {
            const doctor = apt.doctorId || {};
            const isCompleted = apt.status === 'Completed';
            const isCancelled = apt.status === 'Cancelled';
            const isScheduled = apt.status === 'Scheduled';

            return (
              <div 
                key={apt._id}
                className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-xs hover:border-[#0057FF]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4 flex-1">
                  <img 
                    src={doctor.photo || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80"} 
                    alt={doctor.name || "Doctor"} 
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-100 flex-shrink-0 bg-slate-50"
                  />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{doctor.name || "Doctor"}</span>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isCompleted ? 'bg-green-50 text-[#16A34A] border-green-200' :
                        isCancelled ? 'bg-red-50 text-[#EF4444] border-red-200' :
                        'bg-blue-50 text-[#0057FF] border-blue-200'
                      }`}>
                        {apt.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium">{doctor.specialization} ({doctor.qualifications})</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-[#0057FF]" />
                        {apt.scheduledDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-[#0057FF]" />
                        {apt.scheduledTimeSlot}
                      </span>
                      <span>•</span>
                      <span className="capitalize text-[#0057FF] font-bold">
                        {apt.mode} Session
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Patient: <span className="font-semibold text-slate-700">{apt.patientName}</span> ({apt.patientAge} yrs, {apt.patientGender})
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2.5 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                  <span className="text-xs font-bold text-slate-900">
                    Fee: ₹{doctor.consultationFee || 499} 
                    <span className={`ml-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-extrabold ${
                      apt.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {apt.paymentStatus}
                    </span>
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    {isScheduled && apt.joinLink && (
                      <a
                        href={apt.joinLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-full bg-[#00a2a4] hover:bg-[#008f91] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <Video size={14} />
                        <span>Join Session</span>
                      </a>
                    )}

                    {apt.prescriptionFileUrl && (
                      <a
                        href={`${API_BASE}${apt.prescriptionFileUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 transition-all flex items-center gap-1.5"
                      >
                        <FileText size={14} />
                        <span>E-Prescription</span>
                      </a>
                    )}

                    {isScheduled && (
                      <button
                        onClick={() => handleCancel(apt._id)}
                        disabled={cancellingId === apt._id}
                        className="px-3 py-2 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center my-6">
          <Calendar size={36} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No Consultations Found</h3>
          <p className="text-xs text-slate-400">Book online doctor consultations to track your health appointments here.</p>
        </div>
      )}
    </div>
  );
};

export default MyAppointmentsTab;
