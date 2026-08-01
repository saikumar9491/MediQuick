import React, { useState, useEffect } from 'react';
import { GripVertical, ArrowUp, ArrowDown, Save, X, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

const DragReorderList = ({
  banners = [],
  isOpen = false,
  onClose,
  onSaveReorder
}) => {
  const [selectedPlacement, setSelectedPlacement] = useState('homepage-hero');
  const [items, setItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Filter banners for selected placement
    const filtered = banners.filter(b => (b.placement || b.category) === selectedPlacement);
    const sorted = [...filtered].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    setItems(sorted);
  }, [selectedPlacement, banners, isOpen]);

  if (!isOpen) return null;

  const moveItem = (index, direction) => {
    const newItems = [...items];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setItems(newItems);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = items.map((item, idx) => ({
        id: item._id,
        displayOrder: idx
      }));
      await onSaveReorder(payload);
      toast.success('Display order saved!');
      onClose();
    } catch (err) {
      console.error('Reorder save failed:', err);
      toast.error('Failed to save display order');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Layers size={18} className="text-[#0057FF]" /> Reorder Display Priority
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              Move items up or down to adjust carousel/display order (top item appears first)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Placement Selector Tab */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Placement:</span>
          {[
            { id: 'homepage-hero', label: 'Homepage Hero' },
            { id: 'category-mini', label: 'Category Mini' },
            { id: 'flash-sale', label: 'Flash Sale' },
            { id: 'mobile-homepage', label: 'Mobile Homepage' },
            { id: 'all-medicines', label: 'All Medicines' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPlacement(p.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedPlacement === p.id 
                  ? 'bg-[#0057FF] text-white shadow-xs' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Reorderable Items List */}
        <div className="p-6 flex-1 overflow-y-auto space-y-2">
          {items.length === 0 ? (
            <div className="text-center py-10 text-xs font-bold text-slate-400 uppercase tracking-widest">
              No banners found in this placement slot
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-black text-slate-400 w-5 text-center">
                    #{idx + 1}
                  </span>
                  <div className="h-10 w-16 rounded bg-slate-200 overflow-hidden shrink-0">
                    {(item.imageUrl || item.image || item.mobileImageUrl) ? (
                      <img src={item.imageUrl || item.image || item.mobileImageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-slate-800" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-slate-900 truncate">
                      {item.name || item.headline || item.title || 'Untitled Banner'}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase">
                      Target: {item.targetDevice || 'both'}
                    </p>
                  </div>
                </div>

                {/* Move Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveItem(idx, -1)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === items.length - 1}
                    onClick={() => moveItem(idx, 1)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || items.length === 0}
            className="px-5 py-2 rounded-xl bg-[#0057FF] text-white text-xs font-black uppercase tracking-wider hover:bg-blue-700 shadow-md flex items-center gap-1.5 cursor-pointer disabled:bg-slate-400"
          >
            <Save size={14} />
            <span>{isSaving ? 'Saving...' : 'Save Order'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default DragReorderList;
