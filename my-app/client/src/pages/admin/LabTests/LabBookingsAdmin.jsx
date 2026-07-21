import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  FileText, 
  Upload, 
  CheckCircle, 
  Loader2,
  X,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getAdminLabBookings, updateBookingStatus, uploadLabReport } from '../../../api/labTests';
import toast from 'react-hot-toast';

const LabBookingsAdmin = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Report upload state
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Status modify state
  const [selectedStatusChangeId, setSelectedStatusChangeId] = useState(null);
  const [agentName, setAgentName] = useState('');
  const [targetStatus, setTargetStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statuses = ['Scheduled', 'Sample Collected', 'Processing', 'Report Ready', 'Cancelled'];

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getAdminLabBookings(token);
      setBookings(data);
    } catch (err) {
      toast.error('Failed to load lab bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!targetStatus) return;

    setUpdatingStatus(true);
    try {
      await updateBookingStatus(token, selectedStatusChangeId, {
        status: targetStatus,
        collectionAgentId: agentName || undefined
      });
      toast.success('Booking status updated');
      setSelectedStatusChangeId(null);
      fetchBookings();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportFile) return toast.error('Please select a PDF report file');

    setUploading(true);
    try {
      await uploadLabReport(token, selectedBookingId, reportFile);
      toast.success('Diagnostic report uploaded successfully!');
      setSelectedBookingId(null);
      setReportFile(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.message || 'Report upload failed');
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadgeStyle = (status) => {
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

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (b.testId?.name && b.testId.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b._id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Diagnostic Booking Dispatch</h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Assign collection agents, upload diagnostic reports, and manage statuses</p>
      </div>

      {/* Filter panel */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white border border-slate-200/50 p-4 rounded-2xl shadow-xs">
        <div className="relative flex-1 w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search bookings by patient, test name or Booking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 pl-9 pr-4 py-2 rounded-xl text-xs outline-none focus:bg-white border border-transparent focus:border-slate-200 transition-all text-slate-700"
          />
        </div>
        
        <div className="flex items-center gap-1.5 self-stretch sm:self-auto">
          <SlidersHorizontal size={12} className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-transparent text-slate-700 outline-none rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer focus:bg-white focus:border-slate-200 transition-all"
          >
            <option value="All">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Bookings List Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-[#00a2a4] w-8 h-8" />
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBookings.map((booking) => {
            const test = booking.testId || {};
            const customer = booking.customerId || {};
            
            return (
              <div 
                key={booking._id}
                className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-4 hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-shadow"
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block font-mono">ID: {booking._id}</span>
                      <h3 className="text-xs font-bold text-slate-800 leading-snug mt-0.5">{test.name || 'Lab Test Package'}</h3>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${getStatusBadgeStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>

                  {/* Detail items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-semibold text-slate-500 border-t border-b border-slate-50 py-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={11} className="text-slate-400 shrink-0" />
                      <span>Date: <strong className="text-slate-700">{booking.scheduledDate}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} className="text-slate-400 shrink-0" />
                      <span>Slot: <strong className="text-slate-700">{booking.scheduledTimeSlot}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={11} className="text-slate-400 shrink-0" />
                      <span>Patient: <strong className="text-slate-700">{booking.patientName} ({booking.patientAge} yr, {booking.patientGender})</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={11} className="text-slate-400 shrink-0" />
                      <span className="truncate">City/State: <strong className="text-slate-700">{booking.address?.city}, {booking.address?.pincode}</strong></span>
                    </div>
                  </div>

                  {/* Address full text */}
                  <div className="text-[10px] text-slate-450 leading-relaxed font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                    <MapPin size={10} className="inline mr-1 text-[#00a2a4]" />
                    <span>{booking.address?.streetAddress}, {booking.address?.city}, {booking.address?.state} ({booking.address?.pincode})</span>
                  </div>

                  {/* Agent assignment display */}
                  {booking.collectionAgentId && (
                    <div className="flex justify-between items-center text-[10px] font-bold bg-[#00a2a4]/5 text-[#00a2a4] p-2.5 rounded-xl border border-[#00a2a4]/10">
                      <span>Collection Agent:</span>
                      <span>{booking.collectionAgentId}</span>
                    </div>
                  )}
                </div>

                {/* Dispatch actions */}
                <div className="flex gap-2 pt-2 border-t border-slate-50 mt-auto justify-end">
                  {booking.status !== 'Cancelled' && booking.status !== 'Report Ready' && (
                    <button
                      onClick={() => {
                        setSelectedStatusChangeId(booking._id);
                        setTargetStatus(booking.status);
                        setAgentName(booking.collectionAgentId || '');
                      }}
                      className="py-1.5 px-4 rounded-full border border-slate-200 text-slate-700 hover:border-slate-800 text-[11px] font-bold transition-all cursor-pointer"
                    >
                      Update Status
                    </button>
                  )}

                  {booking.status !== 'Cancelled' && booking.status !== 'Report Ready' && (
                    <button
                      onClick={() => setSelectedBookingId(booking._id)}
                      className="flex items-center gap-1 py-1.5 px-4 rounded-full bg-[#00a2a4] hover:bg-[#007b7d] text-[11px] font-bold text-white transition-all cursor-pointer shadow-xs"
                    >
                      <Upload size={11} />
                      <span>Upload PDF Report</span>
                    </button>
                  )}

                  {booking.status === 'Report Ready' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-3.5 py-1.5 rounded-full flex items-center gap-1">
                      <CheckCircle size={11} /> Report Ready
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-slate-200/50 rounded-2xl">
          <ShieldAlert className="mx-auto w-8 h-8 text-slate-350 mb-3" />
          <p className="text-xs font-bold text-slate-500">No diagnostic bookings matching filters</p>
        </div>
      )}

      {/* 1. Status Update Modal Overlay */}
      {selectedStatusChangeId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-scaleIn">
            <button 
              onClick={() => setSelectedStatusChangeId(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>

            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">
              Dispatch Update
            </h2>

            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Set Status</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-[#00a2a4] focus:bg-white transition-all text-slate-700"
                >
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Collection Agent Name</label>
                <input 
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="e.g. Dr. John Doe"
                  className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-[#00a2a4] focus:bg-white transition-all text-slate-700"
                />
              </div>

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedStatusChangeId(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-50 text-slate-500 text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  {updatingStatus ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <span>Save Update</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. PDF Report Upload Modal Overlay */}
      {selectedBookingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-scaleIn">
            <button 
              onClick={() => setSelectedBookingId(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>

            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Upload size={16} className="text-[#00a2a4]" /> Upload Report PDF
            </h2>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Select Diagnostic PDF File *</label>
                <input 
                  type="file"
                  required
                  accept=".pdf"
                  onChange={(e) => setReportFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[11px] file:font-bold file:bg-[#00a2a4]/10 file:text-[#00a2a4] hover:file:bg-[#00a2a4]/20"
                />
              </div>

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedBookingId(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-50 text-slate-500 text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {uploading ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <>
                      <CheckCircle size={13} />
                      <span>Upload & Release</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabBookingsAdmin;
