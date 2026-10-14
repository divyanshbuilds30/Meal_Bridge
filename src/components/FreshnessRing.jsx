import React from 'react';
import { urgencyBand } from '../utils/decay';

export function FreshnessRing({ value = 0, size = 96, strokeWidth = 8, showLabel = true }) {
  const band = urgencyBand(value);
  const clampedValue = Math.min(Math.max(value, 0), 1);
  const percentUsed = Math.round(clampedValue * 100);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - clampedValue * circumference;

  const colorMap = {
    fresh: "#16A34A",    // green
    urgent: "#F59E0B",   // amber
    critical: "#DC2626", // red
    expired: "#64748B",  // slate / expired
  };

  const strokeColor = colorMap[band] || colorMap.fresh;

  return (
    <div className="relative inline-flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s ease' }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {value >= 1.0 ? (
          <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Expired</span>
        ) : (
          <>
            <span
              className="font-heading font-extrabold text-ink leading-none"
              style={{ fontSize: size * 0.22 }}
            >
              {percentUsed}%
            </span>
            {showLabel && (
              <span
                className="text-slate-400 font-medium tracking-tight uppercase"
                style={{ fontSize: Math.max(9, size * 0.1) }}
              >
                used
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
