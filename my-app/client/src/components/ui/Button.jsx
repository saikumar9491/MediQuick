import React from 'react';
export const Button = ({ children, variant = 'primary', size = 'md', onClick, className = '' }) => {
  const base = "inline-flex items-center justify-center font-bold transition-all rounded-lg";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm" };
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
    warning: "bg-orange-500 text-white hover:bg-orange-600",
  };
  return (
    <button onClick={onClick} className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}>
      {children}
    </button>
  );
};
