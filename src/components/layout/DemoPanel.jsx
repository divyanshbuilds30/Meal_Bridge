import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { donors } from '../../data/mockData';
import { Button } from '../ui/Button';

export function DemoPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    ambientTemp,
    setAmbientTemp,
    timeOffsetHours,
    advanceTime,
    currentDonorId,
    setCurrentDonor,
    resetDemo,
  } = useApp();

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Floating Toggle Pill */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/90 text-white text-xs font-semibold shadow-2xl backdrop-blur-md border border-slate-700/80 hover:bg-slate-800 transition-all active:scale-95"
        >
          <span className="text-sm">🎛</span>
          <span>Demo Controls</span>
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping ml-1" />
        </button>
      ) : (
        <div className="w-80 rounded-3xl bg-white/95 p-5 shadow-2xl backdrop-blur-xl border border-slate-200/90 animate-fadeIn text-ink">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎛</span>
              <h4 className="font-heading font-bold text-sm text-ink">Demo Simulation Panel</h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-xs transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* 1. Ambient Temperature Slider */}
            <div>
              <div className="flex items-center justify-between font-semibold mb-1">
                <span>🌤 Ambient Temperature</span>
                <span className="font-heading font-extrabold text-brand-700 text-sm">{ambientTemp}°C</span>
              </div>
              <input
                type="range"
                min="20"
                max="42"
                step="1"
                value={ambientTemp}
                onChange={(e) => setAmbientTemp(e.target.value)}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                Simulated thermal factor (OpenWeather in Phase 2)
              </p>
            </div>

            {/* 2. Time Travel Fast-Forward */}
            <div>
              <div className="flex items-center justify-between font-semibold mb-1">
                <span>⏳ Time Travel</span>
                <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  +{timeOffsetHours} h
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => advanceTime(1)}
                >
                  +1 Hour
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => advanceTime(3)}
                >
                  +3 Hours
                </Button>
              </div>
            </div>

            {/* 3. Act As Donor */}
            <div>
              <label className="block font-semibold mb-1 text-slate-700">🏨 Act As Donor</label>
              <select
                value={currentDonorId}
                onChange={(e) => setCurrentDonor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {donors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.emoji} {d.name} ({d.type})
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Seeded OTP hints */}
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 leading-relaxed font-mono">
              <strong className="text-slate-700 font-sans block mb-0.5">🔑 Seeded Demo OTPs:</strong>
              <div>Pickup p5: <span className="text-ink font-bold">4821</span> • p6: <span className="text-ink font-bold">5937</span></div>
              <div>Dropoff j1: <span className="text-ink font-bold">7305</span> • j2: <span className="text-ink font-bold">2468</span></div>
            </div>

            {/* 5. Reset Demo Button */}
            <div className="pt-1">
              <Button
                variant="danger"
                size="sm"
                className="w-full text-xs"
                onClick={resetDemo}
              >
                ↺ Reset Demo State
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
