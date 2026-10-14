import React from 'react';

export function UrgencyBadge({ band = 'fresh', className = '' }) {
  const badgeMap = {
    fresh: {
      label: "🟢 Fresh",
      classes: "bg-green-50 text-green-700 border-green-200",
    },
    urgent: {
      label: "🟠 Urgent",
      classes: "bg-amber-50 text-amber-700 border-amber-200",
    },
    critical: {
      label: "🔴 Critical",
      classes: "bg-red-50 text-red-700 border-red-200 animate-pulse",
    },
    expired: {
      label: "⚫ Expired",
      classes: "bg-slate-100 text-slate-600 border-slate-300",
    },
  };

  const item = badgeMap[band] || badgeMap.fresh;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${item.classes} ${className}`}
    >
      {item.label}
    </span>
  );
}
