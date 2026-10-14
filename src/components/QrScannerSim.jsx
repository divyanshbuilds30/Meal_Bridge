import React, { useState } from 'react';
import { Button } from './ui/Button';

export function QrScannerSim({ onScanned, title = "Donation Passcard" }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleSimulate = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanned(true);
      if (onScanned) onScanned();
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-64 h-64 rounded-3xl bg-slate-950 flex flex-col items-center justify-center overflow-hidden border-2 border-slate-700 shadow-2xl p-4">
        {/* Corner Brackets */}
        <div className="absolute top-4 left-4 w-7 h-7 border-t-4 border-l-4 border-neon-cyan rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-7 h-7 border-t-4 border-r-4 border-neon-cyan rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-7 h-7 border-b-4 border-l-4 border-neon-cyan rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-7 h-7 border-b-4 border-r-4 border-neon-cyan rounded-br-lg" />

        {/* Animated Scan Line */}
        <div className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-neon-cyan to-transparent shadow-[0_0_8px_#22D3EE] animate-scan-line" />

        {/* Scanner Viewport Center */}
        {scanned ? (
          <div className="text-center z-10 flex flex-col items-center animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-2xl font-bold mb-2">
              ✓
            </div>
            <p className="text-xs font-bold text-green-400 uppercase tracking-wider">QR Matched</p>
            <p className="text-xs text-slate-300 mt-1 max-w-[180px] truncate">{title}</p>
          </div>
        ) : (
          <div className="text-center z-10">
            <span className="text-4xl opacity-40">📷</span>
            <p className="text-xs text-slate-400 mt-3 font-medium">Point camera at donor's QR</p>
            <p className="text-[10px] text-slate-500 mt-0.5">(Simulated Viewfinder)</p>
          </div>
        )}
      </div>

      <div className="mt-4">
        <Button
          variant={scanned ? "secondary" : "primary"}
          size="sm"
          onClick={handleSimulate}
          disabled={isScanning}
        >
          {isScanning ? "Scanning..." : scanned ? "Scan Again" : "Simulate QR Scan"}
        </Button>
      </div>
    </div>
  );
}
