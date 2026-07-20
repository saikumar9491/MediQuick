import React from 'react';
import { Eye, EyeOff, Star, ShieldCheck } from 'lucide-react';

const StatusSection = ({ formData, onChange }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Product Status & Trust</h2>
      
      <div className="space-y-4">
        {/* Active Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${formData.isActive ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
              {formData.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-900">Active Product</h3>
              <p className="text-xs text-slate-500 mt-0.5">When inactive, this product is hidden from customers.</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={formData.isActive}
              onChange={(e) => onChange('isActive', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${formData.isFeatured ? 'bg-orange-100 text-orange-500' : 'bg-slate-200 text-slate-500'}`}>
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-900">Featured Product</h3>
              <p className="text-xs text-slate-500 mt-0.5">Showcase this product in featured sections on the homepage.</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={formData.isFeatured}
              onChange={(e) => onChange('isFeatured', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Verified Authentic Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${formData.verifiedAuthentic ? 'bg-blue-100 text-blue-650' : 'bg-slate-200 text-slate-500'}`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-900">Verified Authentic</h3>
              <p className="text-xs text-slate-500 mt-0.5">Show a "Verified Authentic" trust badge on the product page.</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={formData.verifiedAuthentic}
              onChange={(e) => onChange('verifiedAuthentic', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

      </div>
    </div>
  );
};

export default StatusSection;
