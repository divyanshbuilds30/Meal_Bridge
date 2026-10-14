import React from 'react';

export function StatusStepper({
  stage = 1,
  labels = ["Matched / Claimed", "Driver Assigned", "In Transit", "Delivered ✓"],
}) {
  return (
    <div className="w-full py-3">
      <div className="flex items-center justify-between relative">
        {/* Continuous connector line */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 z-0">
          <div
            className="h-full bg-brand-500 transition-all duration-500"
            style={{ width: `${Math.max(0, Math.min(100, ((stage - 1) / (labels.length - 1)) * 100))}%` }}
          />
        </div>

        {/* Steps */}
        {labels.map((label, index) => {
          const stepNumber = index + 1;
          const isDone = stage > stepNumber || stage === 4;
          const isCurrent = stage === stepNumber && stage !== 4;

          return (
            <div key={label} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  isDone
                    ? "bg-brand-600 text-white shadow-sm ring-4 ring-brand-100"
                    : isCurrent
                    ? "bg-brand-500 text-white shadow-md ring-4 ring-brand-200 animate-pulse"
                    : "bg-white text-slate-400 border-2 border-slate-300"
                }`}
              >
                {isDone ? "✓" : stepNumber}
              </div>
              <span
                className={`mt-2 text-[10px] sm:text-xs text-center font-medium max-w-[70px] sm:max-w-[90px] leading-tight ${
                  isDone || isCurrent ? "text-slate-900 font-semibold" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
