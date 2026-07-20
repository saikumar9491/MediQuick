import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { API_BASE } from '../../utils/apiConfig';

const AddMedicineModal = ({ isOpen, onClose, onAdd, initialData }) => {
  const [categories, setCategories] = useState([
    { name: 'Hair Care', subOptions: ['Hair Oils', 'Shampoos & Conditioners', 'Hair Serums', 'Hair Creams & Masks', 'Hair Colour', 'Hair Growth Products', 'Essential Oils'] },
    { name: 'Fitness & Health', subOptions: ['Vitamins', 'Proteins', 'Health Drinks', 'Gym Accessories'] },
    { name: 'Sexual Wellness', subOptions: ['Condoms', 'Lubricants', 'Personal Wash', 'Performance'] },
    { name: 'Vitamins & Nutrition', subOptions: ['Multivitamins', 'Minerals', 'Omega & Fish Oil', 'Biotin'] },
    { name: 'Supports & Braces', subOptions: ['Knee Supports', 'Back Supports', 'Ankle Supports', 'Wrist Supports'] },
    { name: 'Immunity Boosters', subOptions: ['Chyawanprash', 'Herbal Juices', 'Vitamin C', 'Zinc'] },
    { name: 'Skin Care', subOptions: ['Face Wash', 'Moisturizers', 'Sunscreen', 'Anti-Aging'] },
    { name: 'Diabetes', subOptions: ['Insulin', 'Glucose Monitors', 'Diabetic Diet', 'Supplements'] },
    { name: 'Cardiac', subOptions: ['Blood Pressure', 'Cholesterol', 'Heart Support', 'Aspirin'] },
    { name: 'Ayurveda', subOptions: ['Chyawanprash', 'Ashwagandha', 'Herbal Tea', 'Triphala'] },
    { name: 'Pet Care', subOptions: ['Dog Food', 'Cat Food', 'Pet Grooming', 'Pet Medicines'] }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    brand: '',
    category: 'Hair Care',
    subCategory: '',
    image: '',
    needsRx: false,
    isFlashDeal: false,
    isTrending: false,
    discountPrice: '',
  });

  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  // Fetch dynamic categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/categories`);
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        // Only update if we actually got data from the database
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Database Categories Fetch failed, using fallback list:', err);
      }
    };
    if (isOpen) fetchCategories();
  }, [isOpen]);

  // Handle Initial Data or Reset
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        price: '',
        brand: '',
        category: categories.length > 0 ? categories[0].name : '',
        subCategory: '',
        image: '',
        needsRx: false,
        isFlashDeal: false,
        isTrending: false,
        discountPrice: '',
      });
    }
  }, [initialData, isOpen, categories]);

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanData = {
      ...formData,
      brand: formData.brand.trim(),
      name: formData.name.trim()
    };
    onAdd(cleanData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm animate-[fadeIn_0.25s_ease-out]">
      <div className="w-full max-w-md sm:max-w-xl max-h-[92vh] overflow-y-auto rounded-xl bg-white shadow-2xl animate-[modalPop_0.28s_ease-out] relative">
        <div className="sticky top-0 z-[210] flex items-center justify-between border-b bg-gray-50 px-4 py-4 sm:px-6 sm:py-5">
          <h2 className="pr-3 text-sm sm:text-base font-black uppercase italic tracking-tight text-slate-800">
            {initialData ? 'Edit Unit Protocol' : 'Register New Inventory'}
          </h2>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-200 hover:text-gray-800"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-4 py-4 sm:px-6 sm:py-6">
          <div className="space-y-1">
            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Medicine Name
            </label>
            <input
              type="text"
              value={formData.name}
              required
              className="w-full rounded-md border border-slate-200 p-3 text-sm font-bold uppercase italic tracking-tight outline-none transition focus:border-[#00a2a4]"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="w-full sm:w-1/2 space-y-1">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Price (₹)
              </label>
              <input
                type="number"
                value={formData.price}
                required
                className="w-full rounded-md border border-slate-200 p-3 text-sm font-bold outline-none transition focus:border-[#00a2a4]"
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div className="w-full sm:w-1/2 space-y-1">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Brand
              </label>
              <input
                type="text"
                value={formData.brand}
                required
                className="w-full rounded-md border border-slate-200 p-3 text-sm font-bold uppercase tracking-tight outline-none transition focus:border-[#00a2a4]"
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>
          </div>

          {/* Custom Category Dropdown */}
          <div className="space-y-1 relative">
            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Category Classification
            </label>
            <div 
              className="w-full rounded-md border border-slate-200 bg-white p-3 text-sm font-bold outline-none transition cursor-pointer flex items-center justify-between hover:border-[#00a2a4]"
              onClick={() => {
                setShowCategoryDropdown(!showCategoryDropdown);
                setShowSubCategoryDropdown(false);
              }}
            >
              <span className="text-slate-700">{formData.category || 'Select Category'}</span>
              <span className={`transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`}>▼</span>
            </div>
            
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 right-0 z-[220] mt-1 max-h-60 overflow-y-auto rounded-md bg-white shadow-xl border border-slate-100 py-1 animate-fadeIn">
                {categories.map(catObj => (
                  <div
                    key={catObj._id}
                    className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-teal-50 hover:text-[#00a2a4] cursor-pointer transition-colors"
                    onClick={() => {
                      setFormData({ 
                        ...formData, 
                        category: catObj.name, 
                        subCategory: '' // Don't auto-select the first sub-option
                      });
                      setShowCategoryDropdown(false);
                    }}
                  >
                    {catObj.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Custom Sub-Category Dropdown */}
          <div className="space-y-1 relative">
            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Sub-Category (Optional)
            </label>
            <div 
              className="w-full rounded-md border border-slate-200 bg-white p-3 text-sm font-bold outline-none transition cursor-pointer flex items-center justify-between hover:border-[#00a2a4]"
              onClick={() => {
                setShowSubCategoryDropdown(!showSubCategoryDropdown);
                setShowCategoryDropdown(false);
              }}
            >
              <span className={formData.subCategory ? "text-slate-700" : "text-slate-400"}>
                {formData.subCategory || 'Select Sub-Category'}
              </span>
              <span className={`transition-transform duration-200 ${showSubCategoryDropdown ? 'rotate-180' : ''}`}>▼</span>
            </div>

            {showSubCategoryDropdown && (
              <div className="absolute top-full left-0 right-0 z-[220] mt-1 max-h-60 overflow-y-auto rounded-md bg-white shadow-xl border border-slate-100 py-1 animate-fadeIn">
                {!formData.category && (
                  <div className="px-4 py-2 text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50/50">
                    Select Category Classification First
                  </div>
                )}
                <div
                  className="px-4 py-2.5 text-sm font-bold text-slate-400 italic hover:bg-slate-50 cursor-pointer border-b border-slate-50"
                  onClick={() => {
                    setFormData({ ...formData, subCategory: '' });
                    setShowSubCategoryDropdown(false);
                  }}
                >
                  None / General (No Sub-Category)
                </div>
                {categories.find(c => c.name === formData.category)?.subOptions?.map(sub => (
                  <div
                    key={sub}
                    className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-teal-50 hover:text-[#00a2a4] cursor-pointer transition-colors"
                    onClick={() => {
                      setFormData({ ...formData, subCategory: sub });
                      setShowSubCategoryDropdown(false);
                    }}
                  >
                    {sub}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Cloud Image Link
            </label>
            <input
              type="text"
              value={formData.image}
              placeholder="https://..."
              className="w-full rounded-md border border-slate-200 p-3 text-sm font-bold outline-none transition focus:border-[#00a2a4]"
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>

          <label className="group flex cursor-pointer items-start gap-3 rounded-md border border-dashed border-slate-300 bg-slate-50 p-3 transition-colors hover:bg-teal-50">
            <input
              type="checkbox"
              checked={formData.needsRx}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#00a2a4]"
              onChange={(e) => setFormData({ ...formData, needsRx: e.target.checked })}
            />
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-500 transition-colors group-hover:text-[#00a2a4]">
              Requires Rx Protocol (Amritsar Hub Safety)
            </span>
          </label>

          <div className="rounded-md border border-blue-100 bg-blue-50/50 p-4 space-y-3">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isFlashDeal}
                className="h-4 w-4 accent-blue-600"
                onChange={(e) => setFormData({ ...formData, isFlashDeal: e.target.checked })}
              />
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-blue-600">
                Mark as Daily Flash Deal
              </span>
            </label>

            {formData.isFlashDeal && (
              <div className="space-y-1 animate-fadeIn">
                <label className="ml-1 text-[9px] font-black uppercase tracking-widest text-blue-400">
                  Flash Sale Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.discountPrice}
                  placeholder="Lower than regular price"
                  className="w-full rounded-md border border-blue-200 p-2.5 text-sm font-bold outline-none transition focus:border-blue-500"
                  onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className="rounded-md border border-orange-100 bg-orange-50/50 p-4 space-y-3">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isTrending}
                className="h-4 w-4 accent-orange-500"
                onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
              />
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-orange-600">
                Mark as Trending Product
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#00a2a4] px-4 py-3.5 sm:py-4 text-xs sm:text-sm font-black uppercase italic tracking-[2px] text-white shadow-lg transition-all hover:bg-[#008284] hover:shadow-xl active:scale-[0.98] disabled:bg-gray-400"
          >
            {loading
              ? 'Establishing Hub Link...'
              : initialData
              ? 'Confirm Update'
              : 'Authorize New Entry'}
          </button>
        </form>
        <div className="h-20"></div> {/* Extra space at bottom to ensure dropdown space */}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalPop {
          0% {
            opacity: 0;
            transform: scale(0.96) translateY(18px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AddMedicineModal;
