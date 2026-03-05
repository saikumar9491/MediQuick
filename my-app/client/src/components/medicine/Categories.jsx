import React from 'react';

const categories = [
  { name: 'All', icon: '💊' },
  { name: 'Pain Relief', icon: '🩹' },
  { name: 'Vitamins', icon: '🍎' },
  { name: 'Antibiotics', icon: '🧬' },
  { name: 'Personal Care', icon: '🧴' },
];

const Categories = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => setActiveCategory(cat.name)}
          className={`flex items-center space-x-2 px-6 py-3 rounded-full border transition-all whitespace-nowrap ${
            activeCategory === cat.name
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
          }`}
        >
          <span>{cat.icon}</span>
          <span className="font-medium">{cat.name}</span>
        </button>
      ))}
    </div>
  );
};

export default Categories;