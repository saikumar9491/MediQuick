import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Zap, Shield, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  { id: 1, name: 'Electrician', icon: '⚡', color: 'bg-yellow-100 text-yellow-600' },
  { id: 2, name: 'Plumbing', icon: '🚰', color: 'bg-blue-100 text-blue-600' },
  { id: 3, name: 'Cleaning', icon: '🧹', color: 'bg-green-100 text-green-600' },
  { id: 4, name: 'AC Repair', icon: '❄️', color: 'bg-cyan-100 text-cyan-600' },
  { id: 5, name: 'Beauty', icon: '💄', color: 'bg-pink-100 text-pink-600' },
  { id: 6, name: 'Mechanic', icon: '🔧', color: 'bg-slate-100 text-slate-600' },
];

const featuredServices = [
  {
    id: '1',
    title: 'Professional Home Cleaning',
    price: '$49.99',
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'Expert Electrician Service',
    price: '$35.00',
    rating: 4.9,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    title: 'Emergency Plumbing Fix',
    price: '$40.00',
    rating: 4.7,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
  }
];

export default function Home() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-20"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight"
          >
            Reliable Services <br />
            <span className="text-primary-600">At Your Doorstep</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Book expert professionals for all your home needs. Quick, reliable, and guaranteed satisfaction.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 p-2 bg-white rounded-2xl shadow-2xl shadow-primary-500/10 border border-slate-100"
          >
            <div className="flex-grow flex items-center px-4 border-b md:border-b-0 md:border-r border-slate-100">
              <MapPin className="text-primary-500 mr-2" size={20} />
              <input type="text" placeholder="Your Location" className="w-full py-3 focus:outline-none" />
            </div>
            <div className="flex-grow flex items-center px-4">
              <Search className="text-slate-400 mr-2" size={20} />
              <input type="text" placeholder="Search for services (e.g. Electrician)" className="w-full py-3 focus:outline-none" />
            </div>
            <button className="btn-primary">Find Services</button>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className={`text-4xl p-4 rounded-xl mb-4 ${cat.color}`}>
                {cat.icon}
              </div>
              <span className="font-semibold text-slate-700">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Services */}
      <section className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Services</h2>
            <p className="text-slate-500">Highest rated professionals in your area</p>
          </div>
          <Link to="/services" className="text-primary-600 font-semibold hover:underline">View All</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ y: -10 }}
              className="group rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-lg"
            >
              <div className="relative h-56 overflow-hidden">
                <img src={service.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={service.title} />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold flex items-center">
                  <Star className="text-yellow-400 fill-yellow-400 mr-1" size={14} />
                  {service.rating}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold group-hover:text-primary-600 transition-colors">{service.title}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-slate-900">{service.price}</span>
                  <Link to={`/book/${service.id}`} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-all">
                    Book Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-900 py-20">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 bg-primary-500/20 rounded-2xl">
              <Zap className="text-primary-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white">Instant Booking</h3>
            <p className="text-slate-400">Book any service in less than 60 seconds. No more waiting.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 bg-primary-500/20 rounded-2xl">
              <Shield className="text-primary-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white">Verified Pros</h3>
            <p className="text-slate-400">Every professional is background checked and highly trained.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 bg-primary-500/20 rounded-2xl">
              <Clock className="text-primary-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white">On-Time Service</h3>
            <p className="text-slate-400">We value your time. Guaranteed on-time arrival for every booking.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
