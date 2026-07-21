import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Download, 
  XCircle, 
  ShieldCheck, 
  CheckCircle,
  FileText,
  Loader2
} from 'lucide-react';
import { getMyLabBookings, cancelLabTestBooking } from '../../../api/labTests';
import { useAuth } from '../../../context/AuthContext';
import { API_BASE } from '../../../utils/apiConfig';
import toast from 'react-hot-toast';

const MyLabBookingsTab = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    const activeToken = token || localStorage.getItem('userToken');
    if (!activeToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getMyLabBookings(activeToken);
      setBookings(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(id);
    try {
      await cancelLabTestBooking(token, id);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'Sample Collected':
        return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Processing':
        return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      case 'Report Ready':
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Cancelled':
        return 'text-slate-400 bg-slate-50 border-slate-100';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="animate-spin text-[#00a2a4] w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1.5">My Lab Bookings</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Track diagnostic orders & download report PDFs</p>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const test = booking.testId || {};
            const isScheduled = booking.status === 'Scheduled';
            const isReportReady = booking.status === 'Report Ready';
            const reportUrl = booking.reportFileUrl ? `${API_BASE}${booking.reportFileUrl}` : '';

            return (
              <div 
                key={booking._id} 
                className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  {/* Status & Name info */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-800 leading-snug">
                      {test.name || 'Lab Test'}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>

                  {/* Booking details list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[11px] font-semibold text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-slate-400 shrink-0" />
                      <span>Date: <strong className="text-slate-700">{booking.scheduledDate}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-slate-400 shrink-0" />
                      <span>Slot: <strong className="text-slate-700">{booking.scheduledTimeSlot}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileText size={12} className="text-slate-400 shrink-0" />
                      <span>Patient: <strong className="text-slate-700">{booking.patientName} ({booking.patientAge} yr, {booking.patientGender})</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate">Address: <strong className="text-slate-700">{booking.address?.streetAddress}, {booking.address?.city}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Booking actions */}
                <div className="flex md:flex-col gap-2 shrink-0 md:items-end">
                  {isReportReady && reportUrl && (
                    <a
                      href={reportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 py-2 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-[11px] font-bold text-white transition-all shadow-md cursor-pointer"
                    >
                      <Download size={12} />
                      <span>Download Report</span>
                    </a>
                  )}

                  {isScheduled && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="flex items-center gap-1 py-1.5 px-4 rounded-full border border-red-200 text-red-500 hover:bg-red-50 text-[11px] font-bold transition-all cursor-pointer disabled:opacity-50"
                    >
                      {cancellingId === booking._id ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        <XCircle size={11} />
                      )}
                      <span>Cancel Schedule</span>
                    </button>
                  )}

                  {!isScheduled && !isReportReady && (
                    <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider flex items-center gap-1 bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg">
                      <Clock size={11} /> Processing
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
          <Calendar className="mx-auto w-8 h-8 text-slate-300 mb-3" />
          <p className="text-xs font-bold text-slate-500">No diagnostic bookings found</p>
          <p className="text-[10px] text-slate-450 mt-1">Book home sample collections to view schedules here.</p>
        </div>
      )}
    </div>
  );
};

export default MyLabBookingsTab;
