import React from 'react';
import { Link } from 'react-router-dom';
import { DemoPanel } from './DemoPanel';

export function MobileFrame({ children }) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 antialiased">
      {/* Top back bar on desktop */}
      <div className="w-full max-w-md hidden sm:flex items-center justify-between pb-3 px-2 text-slate-400 text-xs">
        <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
          ← Back to MealBridge Home
        </Link>
        <span className="font-mono text-slate-500">Driver Mode (Mobile Viewport)</span>
      </div>

      {/* Centered Phone Shell */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[780px] bg-white sm:rounded-[36px] shadow-2xl border-0 sm:border-8 sm:border-slate-800 flex flex-col overflow-hidden relative">
        {/* Subtle mobile status bar on top */}
        <div className="h-6 bg-slate-100 flex items-center justify-between px-6 text-[11px] font-semibold text-slate-500 shrink-0">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Inner Mobile Screen Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>

      {/* Floating Demo Panel */}
      <DemoPanel />
    </div>
  );
}
