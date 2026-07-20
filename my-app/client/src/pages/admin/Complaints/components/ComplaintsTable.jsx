import React from 'react';
import { Loader2, Inbox, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const ComplaintsTable = ({ 
  complaints, loading, currentPage, totalPages, totalCount, limit, 
  onPageChange, onLimitChange, onRowClick, onStatusUpdate 
}) => {

  const handleStatusChange = async (e, id, currentStatus) => {
    e.stopPropagation();
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;

    try {
      const token = localStorage.getItem('userToken');
      await axios.patch(`${API_BASE}/api/complaints/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Status updated');
      onStatusUpdate();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-700',
      'In Progress': 'bg-orange-100 text-orange-700',
      'Resolved': 'bg-emerald-100 text-emerald-700',
      'Escalated': 'bg-rose-100 text-rose-700'
    };
    return `px-2 py-1 rounded font-bold text-[10px] uppercase ${colors[status] || 'bg-slate-100 text-slate-700'}`;
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      'Low': 'bg-slate-100 text-slate-600',
      'Medium': 'bg-orange-100 text-orange-700',
      'High': 'bg-rose-100 text-rose-700',
      'Urgent': 'bg-red-100 text-red-700 border border-red-200'
    };
    return `px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${colors[priority] || 'bg-slate-100 text-slate-700'}`;
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
        <p className="font-medium">Loading complaints...</p>
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-slate-400 bg-white">
        <Inbox className="w-12 h-12 mb-4 text-slate-300" />
        <h3 className="text-lg font-bold text-slate-700">No Complaints Found</h3>
        <p className="text-sm">We couldn't find any complaints matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-black text-slate-500">
              <th className="p-4">Complaint ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Category</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Assigned To</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date Raised</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {complaints.map(complaint => (
              <tr 
                key={complaint._id}
                onClick={() => onRowClick(complaint._id)}
                className="hover:bg-slate-50 cursor-pointer transition-colors bg-white group"
              >
                <td className="p-4">
                  <span className="font-mono font-bold text-slate-700 text-sm">{complaint.complaintId}</span>
                </td>
                <td className="p-4">
                  <p className="font-bold text-slate-800 text-sm">{complaint.customerId?.name || 'Unknown User'}</p>
                  <p className="text-xs text-slate-500">{complaint.customerId?.phone || ''}</p>
                </td>
                <td className="p-4">
                  <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">
                    {complaint.category}
                  </span>
                </td>
                <td className="p-4">
                  <span className={getPriorityBadge(complaint.priority)}>{complaint.priority}</span>
                </td>
                <td className="p-4">
                  {complaint.assignedTo ? (
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                        {complaint.assignedTo.name.charAt(0)}
                      </div>
                      {complaint.assignedTo.name}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 italic">Unassigned</span>
                  )}
                </td>
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={complaint.status}
                    onChange={(e) => handleStatusChange(e, complaint._id, complaint.status)}
                    className={`${getStatusBadge(complaint.status)} cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-6 bg-no-repeat bg-right`}
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundPosition: 'right 4px center' }}
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Escalated">Escalated</option>
                  </select>
                </td>
                <td className="p-4 text-sm text-slate-600">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-200 bg-white rounded-b-xl flex justify-between items-center text-sm">
        <div className="text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-700">{(currentPage - 1) * limit + 1}</span> to <span className="font-bold text-slate-700">{Math.min(currentPage * limit, totalCount)}</span> of <span className="font-bold text-slate-700">{totalCount}</span> complaints
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Rows per page:</span>
            <select 
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-500 font-medium text-slate-700"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-3 py-1 bg-slate-100 rounded font-bold text-slate-700">
              {currentPage} / {totalPages || 1}
            </span>
            <button 
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
