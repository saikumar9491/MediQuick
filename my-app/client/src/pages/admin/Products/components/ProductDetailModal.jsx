import React from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { Badge } from '../../../../components/ui/Badge';
import { Image as ImageIcon, Package, Activity, AlertOctagon, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProductDetailModal = ({ isOpen, onClose, product }) => {
  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Product Details" maxWidth="max-w-2xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Mock Image */}
        <div className="w-full md:w-1/3 aspect-square bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-400">
          <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
          <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
        </div>

        {/* Details */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-xl font-black text-slate-800">{product.name}</h3>
              <Badge variant={product.status === 'Active' ? 'primary' : 'secondary'}>{product.status}</Badge>
            </div>
            <p className="text-sm font-bold text-slate-500">{product.generic}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Price</p>
              <p className="text-lg font-black text-slate-800">₹{product.price}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</p>
              <p className="text-sm font-bold text-slate-700">{product.category}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Manufacturer</p>
              <p className="text-sm font-bold text-slate-700">{product.mfg}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Prescription</p>
              <p className="text-sm font-bold text-slate-700">{product.rx ? <span className="text-orange-600">Required</span> : 'Not Required'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><Package className="h-4 w-4" /></div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock Level</p>
                <p className="text-sm font-black text-slate-800">{product.stock} Units</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><Activity className="h-4 w-4" /></div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expiry Date</p>
                <p className="text-sm font-black text-slate-800">{product.expiry}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
          Close
        </button>
        <Link to={`/admin/add-product?edit=${product.id}`}>
          <button className="px-4 py-2 text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Product
          </button>
        </Link>
      </div>
    </Modal>
  );
};
