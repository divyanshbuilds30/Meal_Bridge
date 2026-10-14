import React from 'react';
import { STATUS, STATUS_LABEL } from '../../utils/constants';

export function StatusChip({ status, className = '' }) {
  const label = STATUS_LABEL[status] || status;

  const styleMap = {
    [STATUS.POSTED]: "bg-slate-100 text-slate-700 border-slate-200",
    [STATUS.ALGORITHMICALLY_MATCHED]: "bg-violet-50 text-violet-700 border-violet-200 font-semibold",
    [STATUS.CLAIMED]: "bg-blue-50 text-blue-700 border-blue-200 font-semibold",
    [STATUS.IN_TRANSIT]: "bg-amber-50 text-amber-700 border-amber-200 font-semibold",
    [STATUS.DELIVERED_VERIFIED]: "bg-green-50 text-green-700 border-green-200 font-bold",
    [STATUS.EXPIRED_AUTOMATED_PURGE]: "bg-red-50 text-red-700 border-red-200 font-semibold",
  };

  const currentStyle = styleMap[status] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border tracking-tight ${currentStyle} ${className}`}
    >
      {status === STATUS.DELIVERED_VERIFIED && <span className="mr-1">✓</span>}
      {status === STATUS.EXPIRED_AUTOMATED_PURGE && <span className="mr-1">⛔</span>}
      {label}
    </span>
  );
}
