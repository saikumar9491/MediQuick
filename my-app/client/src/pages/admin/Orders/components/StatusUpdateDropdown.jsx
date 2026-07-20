import React from 'react';

const statuses = ['Placed', 'Confirmed', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'];

const statusColors = {
  'Delivered': 'bg-green-100 text-green-800',
  'Placed': 'bg-blue-100 text-blue-800',
  'Confirmed': 'bg-blue-100 text-blue-800',
  'Processing': 'bg-orange-100 text-orange-800',
  'Out for Delivery': 'bg-orange-100 text-orange-800',
  'Cancelled': 'bg-red-100 text-red-800'
};

const StatusUpdateDropdown = ({ currentStatus, orderId, onStatusChange }) => {
  const handleChange = (e) => {
    onStatusChange(orderId, e.target.value);
  };

  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 ${statusColors[currentStatus] || 'bg-gray-100 text-gray-800'}`}
    >
      {statuses.map((status, index) => {
        // Simple client-side disabling to match backend logic visually
        // Cancelled can always be selected unless it's already cancelled
        let disabled = false;
        if (currentStatus !== 'Cancelled' && status !== 'Cancelled') {
          if (index < currentIndex) disabled = true; // Cannot go backwards
        }
        if (currentStatus === 'Cancelled') {
          disabled = true; // Cannot uncancel
        }

        return (
          <option key={status} value={status} disabled={disabled} className="bg-white text-slate-800 font-normal">
            {status}
          </option>
        );
      })}
    </select>
  );
};

export default StatusUpdateDropdown;
