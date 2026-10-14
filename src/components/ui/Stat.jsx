import React from 'react';
import { Card } from './Card';

export function Stat({ label, value, icon: Icon, hint, className = '' }) {
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl md:text-3xl font-extrabold text-ink mt-1 font-heading">{value}</p>
          {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            {typeof Icon === 'string' ? <span className="text-xl">{Icon}</span> : <Icon className="w-5 h-5" />}
          </div>
        )}
      </div>
    </Card>
  );
}
