import React from 'react';

const CATEGORIES = {
  'Health Resource Center': ['All Medicines', 'Lab Tests', 'Ayurveda', 'Consult Top Doctors', 'Care Plan'],
  'Hair Care': ['Hair Oils', 'Shampoos & Conditioners', 'Hair Serums', 'Hair Creams & Masks', 'Hair Colour', 'Hair Growth Products', 'Essential Oils'],
  'Fitness & Health': ['Vitamins', 'Proteins', 'Health Drinks', 'Gym Accessories'],
  'Sexual Wellness': ['Condoms', 'Lubricants', 'Personal Wash', 'Performance'],
  'Vitamins & Nutrition': ['Multivitamins', 'Minerals', 'Omega & Fish Oil', 'Biotin'],
  'Supports & Braces': ['Knee Supports', 'Back Supports', 'Ankle Supports', 'Wrist Supports'],
  'Immunity Boosters': ['Chyawanprash', 'Herbal Juices', 'Vitamin C', 'Zinc'],
  'Homeopathy': ['Cough & Cold', 'Digestion', 'Skin Care', 'Hair Care'],
  'Pet Care': ['Dog Food', 'Cat Food', 'Pet Grooming', 'Pet Medicines']
};

const BasicInfoSection = ({ formData, onChange, errors }) => {
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    onChange('category', newCategory);
    onChange('subCategory', ''); // Reset subcategory when category changes
  };

  const subCategories = formData.category ? CATEGORIES[formData.category] || [] : [];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors ${errors.name ? 'border-red-500' : 'border-slate-300'}`}
              placeholder="e.g. Dolo 650mg Tablet"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Brand / Manufacturer <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => onChange('brand', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors ${errors.brand ? 'border-red-500' : 'border-slate-300'}`}
              placeholder="e.g. Micro Labs Ltd"
            />
            {errors.brand && <p className="mt-1 text-sm text-red-500">{errors.brand}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Salt / Generic Composition <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.salt}
            onChange={(e) => onChange('salt', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors ${errors.salt ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="e.g. Paracetamol (650mg)"
          />
          {errors.salt && <p className="mt-1 text-sm text-red-500">{errors.salt}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={handleCategoryChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors bg-white ${errors.category ? 'border-red-500' : 'border-slate-300'}`}
            >
              <option value="">Select a Category</option>
              {Object.keys(CATEGORIES).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Subcategory <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.subCategory}
              onChange={(e) => onChange('subCategory', e.target.value)}
              disabled={!formData.category}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors bg-white disabled:bg-slate-100 disabled:cursor-not-allowed ${errors.subCategory ? 'border-red-500' : 'border-slate-300'}`}
            >
              <option value="">Select a Subcategory</option>
              {subCategories.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            {errors.subCategory && <p className="mt-1 text-sm text-red-500">{errors.subCategory}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors resize-y"
            placeholder="Detailed description, marketing copy, and key benefits..."
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
