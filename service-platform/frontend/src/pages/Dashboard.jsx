import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, CheckCircle2, Clock3, AlertCircle } from 'lucide-react';

const myBookings = [
  {
    id: 'BK101',
    service: 'Professional Home Cleaning',
    provider: 'John Cleaners',
    date: 'May 15, 2024',
    time: '10:30 AM',
    status: 'Upcoming',
    price: '$51.99',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'BK98',
    service: 'Expert Electrician',
    provider: 'Mike Sparks',
    date: 'May 10, 2024',
    time: '02:00 PM',
    status: 'Completed',
    price: '$35.00',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=200'
  }
];

export default function Dashboard() {
  return (
    <div className="pt-24 pb-20 px-6 bg-slate-50 min-h-screen">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">My Bookings</h1>
            <p className="text-slate-500">Manage and track your service appointments</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-primary-600">$86.99</p>
            </div>
            <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Bookings</p>
              <p className="text-2xl font-bold text-slate-900">2</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {myBookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6 flex flex-col md:flex-row gap-8 items-center"
            >
              <img src={booking.image} className="w-32 h-32 rounded-2xl object-cover" alt={booking.service} />
              
              <div className="flex-grow space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-slate-900">{booking.service}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        booking.status === 'Upcoming' ? 'bg-primary-100 text-primary-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-slate-500 font-medium">by {booking.provider}</p>
                  </div>
                  <p className="text-lg font-bold text-slate-900">ID: {booking.id}</p>
                </div>

                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar size={18} className="text-primary-500" />
                    <span className="font-semibold">{booking.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock size={18} className="text-primary-500" />
                    <span className="font-semibold">{booking.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin size={18} className="text-primary-500" />
                    <span className="font-semibold">Home, New York</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto flex flex-col gap-3">
                <p className="text-2xl font-bold text-slate-900 text-center md:text-right mb-2">{booking.price}</p>
                <button className="btn-secondary py-2 text-sm w-full">View Details</button>
                {booking.status === 'Upcoming' && (
                  <button className="text-red-500 font-bold text-sm hover:underline">Cancel Booking</button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
