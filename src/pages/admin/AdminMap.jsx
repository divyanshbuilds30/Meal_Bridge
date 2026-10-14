import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { donors, ngos, activityFeedSeed } from '../../data/mockData';
import { STATUS, FHRI_AUDIT_THRESHOLD } from '../../utils/constants';
import { DemoPanel } from '../../components/layout/DemoPanel';

export function AdminMap() {
  const { posts, jobs, getFhri } = useApp();

  // Live Clock
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Live Activity Feed rotation (every 6 seconds prepend next item)
  const [feedIndex, setFeedIndex] = useState(0);
  const [feedItems, setFeedItems] = useState(activityFeedSeed.slice(0, 5));

  useEffect(() => {
    const interval = setInterval(() => {
      setFeedIndex((prevIdx) => {
        const nextIdx = (prevIdx + 1) % activityFeedSeed.length;
        const nextMessage = activityFeedSeed[nextIdx];
        setFeedItems((prevFeed) => [nextMessage, ...prevFeed.slice(0, 5)]);
        return nextIdx;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Compute live surplus metrics
  const availableStatuses = [STATUS.POSTED, STATUS.ALGORITHMICALLY_MATCHED, STATUS.CLAIMED];
  const surplusKg = posts
    .filter((p) => availableStatuses.includes(p.status))
    .reduce((acc, p) => acc + p.weightKg, 0);

  const inTransitJobs = jobs.filter((j) => j.status === STATUS.IN_TRANSIT);
  const inTransitKg = posts
    .filter((p) => p.status === STATUS.IN_TRANSIT)
    .reduce((acc, p) => acc + p.weightKg, 0);

  const deliveredKg = posts
    .filter((p) => p.status === STATUS.DELIVERED_VERIFIED)
    .reduce((acc, p) => acc + p.weightKg, 0);

  const autoPurgedCount = posts.filter(
    (p) => p.status === STATUS.EXPIRED_AUTOMATED_PURGE
  ).length;

  const flaggedDonorsCount = donors.filter(
    (d) => getFhri(d.id) < FHRI_AUDIT_THRESHOLD
  ).length;

  // Active donor IDs that should have pulsing nodes
  const activeDonorIds = new Set(
    posts
      .filter((p) => p.status !== STATUS.DELIVERED_VERIFIED && p.status !== STATUS.EXPIRED_AUTOMATED_PURGE)
      .map((p) => p.donorId)
  );

  return (
    <div className="min-h-screen bg-night-900 text-slate-200 antialiased selection:bg-neon-cyan selection:text-night-900 flex flex-col">
      {/* Top Telemetry Header */}
      <header className="h-16 px-6 bg-night-800/80 border-b border-slate-800 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-night-700 border border-slate-700 flex items-center justify-center text-xl shadow-xs">
            🛰
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-sm text-white tracking-wide uppercase">
                MealBridge Network Telemetry Room
              </h1>
              <span className="w-2 h-2 rounded-full bg-neon-green animate-ping" />
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              MISSION CONTROL • NODE TOPOLOGY v1.0
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-night-700/80 px-3 py-1.5 rounded-xl border border-slate-700/80 text-neon-cyan">
            SYS TIME: {currentTime}
          </div>
          <Link
            to="/"
            className="px-3 py-1.5 rounded-xl bg-night-700 text-slate-300 hover:text-white hover:bg-night-600 transition-colors border border-slate-700"
          >
            ← Exit Console
          </Link>
        </div>
      </header>

      {/* Main Grid View */}
      <div className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: SVG System Map */}
          <div className="lg:col-span-2 rounded-3xl bg-night-800/90 border border-slate-800 p-5 shadow-2xl relative flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <span>🗺️</span> Spatial Food Routing & Transit Topology
              </h3>
              <span className="text-[11px] font-mono text-neon-green">
                {inTransitJobs.length} VECTOR(S) ACTIVE
              </span>
            </div>

            {/* SVG Visualizer */}
            <div className="relative w-full h-[460px] my-3 rounded-2xl bg-night-900 border border-slate-800/80 overflow-hidden">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
              >
                {/* Background Grid Pattern */}
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1E293B" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />

                {/* Transit Vector Lines for in-transit jobs */}
                {inTransitJobs.map((job) => {
                  const firstPost = posts.find((p) => p.id === job.postIds[0]);
                  const donor = donors.find((d) => d.id === firstPost?.donorId);
                  const ngo = ngos.find((n) => n.id === job.ngoId);

                  if (!donor || !ngo) return null;

                  return (
                    <g key={job.id}>
                      <line
                        x1={donor.mapX}
                        y1={donor.mapY}
                        x2={ngo.mapX}
                        y2={ngo.mapY}
                        stroke="#22D3EE"
                        strokeWidth="0.8"
                        strokeDasharray="3 3"
                        className="animate-dash-move"
                      />
                      {/* Animated traveling dispatch packet */}
                      <circle r="1" fill="#22D3EE">
                        <animate
                          attributeName="cx"
                          from={donor.mapX}
                          to={ngo.mapX}
                          dur="3s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="cy"
                          from={donor.mapY}
                          to={ngo.mapY}
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  );
                })}

                {/* Donor Nodes */}
                {donors.map((d) => {
                  const isPulsing = activeDonorIds.has(d.id);
                  return (
                    <g key={d.id} className="cursor-pointer">
                      {isPulsing && (
                        <circle
                          cx={d.mapX}
                          cy={d.mapY}
                          r="1.6"
                          fill="none"
                          stroke="#22C55E"
                          strokeWidth="0.6"
                          className="animate-pulse-ring"
                          style={{
                            transformOrigin: `${d.mapX}px ${d.mapY}px`,
                            transformBox: 'fill-box',
                          }}
                        />
                      )}
                      <circle
                        cx={d.mapX}
                        cy={d.mapY}
                        r="1.6"
                        fill="#22C55E"
                        stroke="#0B1220"
                        strokeWidth="0.4"
                      />
                      <text
                        x={d.mapX}
                        y={d.mapY + 3.8}
                        fill="#F8FAFC"
                        fontSize="2.2"
                        fontWeight="600"
                        textAnchor="middle"
                        fontFamily="Plus Jakarta Sans"
                      >
                        {d.name}
                      </text>
                    </g>
                  );
                })}

                {/* NGO Nodes */}
                {ngos.map((n) => {
                  const isPending = n.verification === 'PENDING';
                  return (
                    <g key={n.id} className="cursor-pointer">
                      <rect
                        x={n.mapX - 1.5}
                        y={n.mapY - 1.5}
                        width="3"
                        height="3"
                        transform={`rotate(45 ${n.mapX} ${n.mapY})`}
                        fill={isPending ? "none" : "#22D3EE"}
                        stroke={isPending ? "#64748B" : "#0B1220"}
                        strokeWidth="0.5"
                      />
                      <text
                        x={n.mapX}
                        y={n.mapY + 4.2}
                        fill={isPending ? "#94A3B8" : "#E2E8F0"}
                        fontSize="2.1"
                        textAnchor="middle"
                        fontFamily="Plus Jakarta Sans"
                      >
                        {n.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Map Legend Overlay */}
              <div className="absolute bottom-3 left-3 bg-night-800/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/80 text-[11px] font-mono flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-neon-green" /> Donor
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rotate-45 bg-neon-cyan" /> NGO
                </span>
                <span className="flex items-center gap-1.5 text-neon-cyan">
                  ┅ In Transit
                </span>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Metrics + Live Activity Feed */}
          <div className="space-y-6 flex flex-col justify-between">
            {/* Live Surplus Metrics */}
            <div className="rounded-3xl bg-night-800/90 border border-slate-800 p-5 shadow-xl space-y-3.5">
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400">
                Network Telemetry Status
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-night-700/60 border border-slate-700/70">
                  <span className="text-[10px] text-slate-400 block">Surplus Available</span>
                  <span className="font-heading font-extrabold text-xl text-neon-green">
                    {surplusKg} kg
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-night-700/60 border border-slate-700/70">
                  <span className="text-[10px] text-slate-400 block">In Transit</span>
                  <span className="font-heading font-extrabold text-xl text-neon-cyan">
                    {inTransitJobs.length} jobs <span className="text-xs font-normal">({inTransitKg} kg)</span>
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-night-700/60 border border-slate-700/70">
                  <span className="text-[10px] text-slate-400 block">Delivered Today</span>
                  <span className="font-heading font-extrabold text-xl text-white">
                    {deliveredKg} kg
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-night-700/60 border border-slate-700/70">
                  <span className="text-[10px] text-slate-400 block">Auto-Purged</span>
                  <span className="font-heading font-extrabold text-xl text-critical">
                    {autoPurgedCount}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-night-700/60 border border-slate-700/70 flex items-center justify-between text-xs">
                <span className="text-slate-400">Flagged Donors (&lt; 0.70 FHRI):</span>
                <span className={`font-bold font-mono px-2 py-0.5 rounded-md ${
                  flaggedDonorsCount > 0 ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                }`}>
                  {flaggedDonorsCount} Node(s)
                </span>
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="rounded-3xl bg-night-800/90 border border-slate-800 p-5 shadow-xl flex-1 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400">
                  Live Dispatch Stream
                </h3>
                <span className="text-[10px] font-mono text-slate-500">Auto-refresh 6s</span>
              </div>

              <div className="space-y-2.5 overflow-hidden flex-1">
                {feedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-night-700/40 border border-slate-700/50 text-xs text-slate-200 animate-fadeIn font-medium leading-tight flex items-center gap-2"
                  >
                    <span className="text-[10px] text-neon-cyan font-mono">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Full-Width Table: Donor Reliability & FHRI Audit */}
        <div className="rounded-3xl bg-night-800/90 border border-slate-800 p-5 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                Commercial Donor Reliability & FHRI Audit Board
              </h3>
              <p className="text-xs text-slate-400">
                Formula: FHRI = 0.5·OnTime + 0.3·Packaging − 0.2·Spoils • Threshold for physical audit: 0.70
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              AUDIT COMPLIANCE MATRIX
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Commercial Donor</th>
                  <th className="py-3 px-4">Entity Type</th>
                  <th className="py-3 px-4">On-Time</th>
                  <th className="py-3 px-4">Packaging</th>
                  <th className="py-3 px-4">Spoils/Rejection</th>
                  <th className="py-3 px-4">FHRI Rating</th>
                  <th className="py-3 px-4 text-right">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {donors.map((d) => {
                  const fhriScore = getFhri(d.id);
                  const isFlagged = fhriScore < FHRI_AUDIT_THRESHOLD;

                  return (
                    <tr
                      key={d.id}
                      className={
                        isFlagged
                          ? "bg-red-950/20 text-red-200"
                          : "hover:bg-night-700/40 text-slate-300"
                      }
                    >
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                        <span>{d.emoji}</span>
                        <span>{d.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{d.type}</td>
                      <td className="py-3.5 px-4 font-mono font-medium">
                        {(d.fhriInputs.onTime * 100).toFixed(0)}%
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium">
                        {(d.fhriInputs.packaging * 100).toFixed(0)}%
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-400">
                        {(d.fhriInputs.spoils * 100).toFixed(0)}%
                      </td>
                      <td className="py-3.5 px-4 font-heading font-extrabold text-sm text-white">
                        {fhriScore.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isFlagged ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-critical text-white shadow-sm">
                            ⚠ Physical Audit Required • Cooked &gt; 10 kg Restricted
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-500/20 text-neon-green border border-green-500/30">
                            ✓ Good Standing
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Floating Demo Control Panel */}
      <DemoPanel />
    </div>
  );
}
