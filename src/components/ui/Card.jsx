import React from 'react';

export function Card({ children, className = '', hover = false, ...props }) {
  const hoverClass = hover ? 'transition-all duration-200 hover:shadow-md hover:border-slate-300' : '';
  return (
    <div
      className={`rounded-2xl bg-white border border-slate-200 p-4 md:p-6 shadow-sm ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
