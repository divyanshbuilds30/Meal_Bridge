import React from 'react';
import { FHRI_AUDIT_THRESHOLD } from '../utils/constants';

export function FhriGauge({ value = 0.75 }) {
  const rounded = Number(value.toFixed(2));
  const isOk = rounded >= FHRI_AUDIT_THRESHOLD;

  // Maximum scale is 0.85 for visualization
  const percent = Math.min(100, Math.max(0, (rounded / 0.85) * 100));
  const thresholdPercent = (FHRI_AUDIT_THRESHOLD / 0.85) * 100;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-700">Food Hygiene & Reliability (FHRI)</span>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            isOk ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800 animate-pulse"
          }`}
        >
          {isOk ? "✓ Good Standing" : "⚠ Audit Flagged"}
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-extrabold font-heading text-ink">{rounded.toFixed(2)}</span>
        <span className="text-xs text-slate-500 font-medium">/ 0.80 max rating</span>
      </div>

      {/* Progress bar with threshold marker */}
      <div className="relative w-full h-3 rounded-full bg-slate-100 overflow-hidden mb-1.5">
        <div
          className={`h-full transition-all duration-700 rounded-full ${
            isOk ? "bg-brand-500" : "bg-critical"
          }`}
          style={{ width: `${percent}%` }}
        />
        {/* 0.70 threshold tick */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-slate-400 z-10 shadow-sm"
          style={{ left: `${thresholdPercent}%` }}
          title="Audit Threshold (0.70)"
        />
      </div>

      <div className="flex justify-between text-[10px] text-slate-400 mb-2">
        <span>0.00</span>
        <span className="font-semibold text-slate-600">Threshold 0.70</span>
        <span>0.85</span>
      </div>

      {!isOk && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 font-medium mb-2">
          ⚠ High-volume cooked meal posting (&gt; 10 kg) is restricted until an on-site physical audit is cleared.
        </div>
      )}

      <p className="text-[10px] text-slate-400 leading-tight">
        Formula: 0.5·OnTime + 0.3·Packaging − 0.2·Spoils
      </p>
    </div>
  );
}
