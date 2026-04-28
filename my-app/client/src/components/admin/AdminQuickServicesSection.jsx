import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ShieldAlert, Plus, Edit, Trash } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminQuickServicesSection = () => {
  const [services, setServices] = useState([
    { id: 1, name: 'Doctor Consultation', description: '24/7 video or audio consultation with certified experts.', status: 'Active', price: '499', icon: '🩺' },
    { id: 2, name: 'Home Lab Tests', description: 'Sample collection right from your doorstep safely.', status: 'Active', price: '799', icon: '🧪' },
    { id: 3, name: 'Care Plan Subscription', description: 'Access premium features and medicine discounts monthly.', status: 'Inactive', price: '199', icon: '💳' },
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [newService, setNewService] = useState({ name: '', description: '', price: '', icon: '⚡' });

  const toggleStatus = (id) => {
    setServices(services.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s));
    toast.success('Service status toggled!');
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newService.name || !newService.price) return toast.error('Fill in required fields');
    setServices([...services, { ...newService, id: Date.now(), status: 'Active' }]);
    setNewService({ name: '', description: '', price: '', icon: '⚡' });
    setShowAdd(false);
    toast.success('Quick Service Added!');
  };

  const handleDelete = (id) => {
    setServices(services.filter(s => s.id !== id));
    toast.success('Service Deleted');
  };

  return (
    <div className="p-6 bg-white/50 backdrop-blur-md rounded-3xl border border-gray-100 shadow-xl animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">
            🛠️ Quick Services Hub
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
            Manage instant healthcare offerings
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-700 active:scale-95"
        >
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1 rounded bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <Edit className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(service.id)} className="p-1 rounded bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                <Trash className="h-4 w-4" />
              </button>
            </div>

            <div className="text-4xl mb-4 bg-teal-50 h-14 w-14 rounded-2xl flex items-center justify-center">
              {service.icon}
            </div>

            <h3 className="text-base font-black italic uppercase text-slate-900 line-clamp-1">
              {service.name}
            </h3>

            <p className="text-xs text-gray-500 font-medium mt-2 line-clamp-2 h-8">
              {service.description}
            </p>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
              <span className="text-lg font-black text-teal-600">
                ₹{service.price}
              </span>
              <button
                onClick={() => toggleStatus(service.id)}
                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors ${
                  service.status === 'Active' 
                    ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {service.status}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <motion.form 
            onSubmit={handleAdd}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-6">
              Create New Quick Service
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Service Name</label>
                <input
                  type="text"
                  required
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="w-full mt-1 p-3 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-teal-500"
                  placeholder="e.g. Physiotherapy"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description</label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="w-full mt-1 p-3 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-teal-500 h-20 resize-none"
                  placeholder="Short service overview..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                    className="w-full mt-1 p-3 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-teal-500"
                    placeholder="299"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Icon Emoji</label>
                  <input
                    type="text"
                    value={newService.icon}
                    onChange={(e) => setNewService({ ...newService, icon: e.target.value })}
                    className="w-full mt-1 p-3 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-teal-500 text-center"
                    placeholder="⚡"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="flex-1 rounded-xl bg-gray-100 py-3 text-xs font-black uppercase tracking-widest text-gray-600 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-teal-600 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-teal-700 shadow-md shadow-teal-600/20"
              >
                Save Service
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </div>
  );
};

export default AdminQuickServicesSection;
