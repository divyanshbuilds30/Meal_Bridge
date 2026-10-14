import React from 'react';

export function RouteTimeline({ stops = [] }) {
  return (
    <div className="relative pl-6 py-1">
      {/* Vertical connecting line */}
      <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-slate-200" />

      <div className="flex flex-col gap-4">
        {stops.map((stop, index) => {
          const isDrop = stop.type === 'drop';
          return (
            <div key={index} className="relative flex items-start gap-2.5 text-xs">
              {/* Dot icon */}
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${
                  isDrop
                    ? "bg-brand-600 text-white ring-2 ring-brand-100"
                    : "bg-amber-500 text-white ring-2 ring-amber-100"
                }`}
              >
                {isDrop ? "🏁" : "📍"}
              </div>

              <div>
                <p className="font-semibold text-ink leading-tight">
                  <span className="text-slate-500 font-normal mr-1">
                    {isDrop ? "Deliver:" : "Pick up:"}
                  </span>
                  {stop.label}
                </p>
                {stop.subtext && (
                  <p className="text-[11px] text-slate-500 mt-0.5">{stop.subtext}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
