import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, MapPin, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

const allServices = [
  { id: '1', title: 'Professional Home Cleaning', provider: 'John Cleaners', price: '$49.99', rating: 4.8, category: 'Cleaning', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=800' },
  { id: '2', title: 'Expert Electrician', provider: 'Mike Sparks', price: '$35.00', rating: 4.9, category: 'Electrician', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800' },
  { id: '3', title: 'Emergency Plumbing', provider: 'Water Pros', price: '$40.00', rating: 4.7, category: 'Plumbing', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800' },
  { id: '4', title: 'AC Deep Maintenance', provider: 'Cool Air Co', price: '$55.00', rating: 4.6, category: 'AC Repair', image: 'https://images.unsplash.com/photo-1599933023848-bfff2344c85f?auto=format&fit=crop&q=80&w=800' },
  { id: '5', title: 'Car Exterior Wash', provider: 'Gloss Auto', price: '$25.00', rating: 4.8, category: 'Car Wash', image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=800' },
  { id: '6', title: 'Full Body Massage', provider: 'Zen Spa', price: '$65.00', rating: 4.9, category: 'Beauty', image: 'https://images.unsplash.com/photo-1544161515-4ae6ce6ea858?auto=format&fit=crop&q=80&w=800' },
];

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredServices = activeCategory === 'All' 
    ? allServices 
    : allServices.filter(s => s.category === activeCategory);

  return (
    <div className="pt-24 pb-20 px-6 container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Discover Services</h1>
          <p className="text-slate-500">Find the best professionals near you</p>
        </div>
        <div className="w-full md:w-96 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search services..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        {['All', 'Cleaning', 'Electrician', 'Plumbing', 'AC Repair', 'Car Wash', 'Beauty'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredServices.map((service, idx) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="relative h-48 overflow-hidden">
              <img src={service.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={service.title} />
              <div className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {service.category}
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors leading-tight">
                  {service.title}
                </h3>
                <div className="flex items-center text-sm font-bold text-slate-700 shrink-0">
                  <Star className="text-yellow-400 fill-yellow-400 mr-1" size={14} />
                  {service.rating}
                </div>
              </div>
              <p className="text-sm text-slate-500">by {service.provider}</p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xl font-bold text-slate-900">{service.price}</span>
                <Link to={`/book/${service.id}`} className="px-5 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors">
                  Book
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
