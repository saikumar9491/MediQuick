import React from 'react';
import { Edit2, Trash2, Loader2, Power, PowerOff, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const CouponsTable = ({ 
  coupons, loading, 
  currentPage, totalPages, totalCount, limit,
  onPageChange, onLimitChange,
  onEdit, onDuplicate, onRowClick, onRefresh 
}) => {

  const handleDelete = async (e, c) => {
    e.stopPropagation();
    
    if (c.usedCount > 0) {
      if (!window.confirm("This coupon has been used and cannot be deleted to preserve order history. Would you like to deactivate it instead?")) return;
      try {
        const token = localStorage.getItem('userToken');
        await axios.patch(`${API_BASE}/api/coupons/${c._id}`, { isActive: false }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Coupon deactivated");
        onRefresh();
      } catch (err) {
        toast.error("Failed to deactivate coupon");
      }
      return;
    }

    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`${API_BASE}/api/coupons/${c._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Coupon deleted");
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete coupon");
    }
  };

  const handleToggleStatus = async (e, id, currentStatus) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('userToken');
      await axios.patch(`${API_BASE}/api/coupons/${id}`, { isActive: !currentStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Coupon ${!currentStatus ? 'activated' : 'deactivated'}`);
      onRefresh();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return (
    <div className="flex-1 flex justify-center items-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );

  if (coupons.length === 0) return (
    <div className="flex-1 flex justify-center items-center text-slate-500 p-12">
      No coupons found matching your criteria.
    </div>
  );

  return (
    <div className="flex flex-col flex-1">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black text-slate-500 tracking-wider">
              <th className="p-4">Code</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Constraints</th>
              <th className="p-4">Usage</th>
              <th className="p-4">Validity</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {coupons.map(c => {
              const now = new Date();
              const validTo = new Date(c.validTo);
              const validFrom = new Date(c.validFrom);
              const isExpired = validTo <= now;
              const isScheduled = validFrom > now;
              
              let statusText = 'Active';
              if (isExpired) statusText = 'Expired';
              if (isScheduled) statusText = 'Scheduled';
              if (!c.isActive) statusText = 'Inactive';

              return (
                <tr 
                  key={c._id} 
                  onClick={() => onRowClick(c._id)}
                  className="hover:bg-slate-50 transition-colors bg-white cursor-pointer"
                >
                  <td className="p-4">
                    <span className="px-3 py-1.5 bg-slate-800 text-white font-mono font-bold text-sm rounded shadow-sm">{c.code}</span>
                  </td>
                  <td className="p-4 font-bold text-blue-600">
                    {c.discountType === 'Percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                    {c.discountType === 'Percentage' && c.maxDiscountCap && (
                      <span className="block text-[10px] text-slate-500 font-medium mt-0.5">Up to ₹{c.maxDiscountCap}</span>
                    )}
                  </td>
                  <td className="p-4 text-xs text-slate-600 space-y-1">
                    <p>Min Order: <strong>₹{c.minOrderValue}</strong></p>
                    <p>Per User: <strong>{c.perCustomerLimit}</strong></p>
                    {c.newCustomersOnly && <span className="inline-block px-1.5 py-0.5 bg-purple-100 text-purple-700 font-bold text-[9px] uppercase rounded mt-1">New Users Only</span>}
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-700">
                    {c.usedCount} / {c.usageLimit || '∞'} used
                  </td>
                  <td className="p-4 text-xs text-slate-600">
                    <p>{validFrom.toLocaleDateString()}</p>
                    <p className="text-slate-400">to</p>
                    <p className={isExpired ? 'text-rose-600 font-bold' : ''}>{validTo.toLocaleDateString()}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded font-bold text-[10px] uppercase ${
                      statusText === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                      statusText === 'Inactive' ? 'bg-slate-100 text-slate-600' :
                      statusText === 'Scheduled' ? 'bg-slate-200 text-slate-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {statusText}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={(e) => handleToggleStatus(e, c._id, c.isActive)} 
                        title={c.isActive ? 'Deactivate' : 'Activate'}
                        className={`p-2 rounded-lg transition-colors ${c.isActive ? 'text-orange-500 hover:bg-orange-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                      >
                        {c.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); onDuplicate(c); }} title="Duplicate" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); onEdit(c); }} title="Edit" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => handleDelete(e, c)} title="Delete" className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm rounded-b-xl">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Rows per page:</span>
          <select 
            value={limit} 
            onChange={(e) => onLimitChange(e.target.value)}
            className="border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-500"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>

        <div className="text-slate-500">
          Showing <span className="font-bold text-slate-700">{totalCount > 0 ? (currentPage - 1) * limit + 1 : 0}</span> to <span className="font-bold text-slate-700">{Math.min(currentPage * limit, totalCount)}</span> of <span className="font-bold text-slate-700">{totalCount}</span> coupons
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="px-2 font-bold text-slate-700">
            {currentPage} / {totalPages || 1}
          </span>
          <button 
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
