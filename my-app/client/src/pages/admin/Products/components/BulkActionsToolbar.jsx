import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Power, Download, X } from 'lucide-react';
import { bulkUpdateProducts } from '../../../../api/products';

export const BulkActionsToolbar = ({ selectedRows, setSelectedRows, onBulkDelete, onRefresh }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  if (selectedRows.length === 0) return null;

  const handleBulkStatus = async (status) => {
    setIsUpdating(true);
    const toastId = toast.loading(`Marking ${selectedRows.length} products as ${status}...`);
    try {
      await bulkUpdateProducts(selectedRows, { isActive: status === 'Active' });
      toast.success(`Successfully updated ${selectedRows.length} products!`, { id: toastId });
      setSelectedRows([]);
      onRefresh && onRefresh();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update products.', { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-20 -mt-2 bg-blue-600 text-white rounded-xl shadow-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center h-6 w-6 bg-blue-500 rounded-full font-black text-xs">
          {selectedRows.length}
        </div>
        <span className="text-sm font-bold">Products Selected</span>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => handleBulkStatus('Active')}
          disabled={isUpdating}
          className="px-3 py-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
        >
          <Power className="h-3.5 w-3.5" />
          Set Active
        </button>
        <button 
          onClick={() => handleBulkStatus('Inactive')}
          disabled={isUpdating}
          className="px-3 py-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
        >
          <Power className="h-3.5 w-3.5 opacity-50" />
          Set Inactive
        </button>
        <button 
          onClick={() => toast.success('Export started!')}
          className="px-3 py-1.5 text-xs font-bold bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors flex items-center gap-1.5 ml-2"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </button>
        <button 
          onClick={onBulkDelete}
          disabled={isUpdating}
          className="px-3 py-1.5 text-xs font-bold bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
        
        <div className="w-px h-4 bg-white/20 mx-2"></div>
        
        <button 
          onClick={() => setSelectedRows([])}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
