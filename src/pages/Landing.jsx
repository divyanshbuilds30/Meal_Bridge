import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';

export function Landing() {
  const { setRole } = useApp();
  const navigate = useNavigate();

  const handleSelectRole = (roleKey, path) => {
    setRole(roleKey);
    navigate(path);
  };

  const roles = [
    {
      key: "donor",
      path: "/donor",
      emoji: "🏨",
      title: "Commercial Donor",
      subtitle: "Hotels, Caterers, Sweet Shops & Bakeries",
      description: "Post surplus food in 1 tap, track real-time decay, and obtain instant digital pickup passcards with OTP verification.",
      actionLabel: "Enter Donor Portal →",
      badge: "Commercial Food",
    },
    {
      key: "recipient",
      path: "/recipient",
      emoji: "🏠",
      title: "Recipient NGO",
      subtitle: "Shelters, Orphanages & Community Kitchens",
      description: "Discover prioritized batches ranked by Max-Heap algorithmic proximity & freshness. Claim and track in real-time.",
      actionLabel: "Enter Recipient Feed →",
      badge: "Verified Shelters",
    },
    {
      key: "driver",
      path: "/driver",
      emoji: "🚚",
      title: "Delivery Partner",
      subtitle: "Delivery Drivers & Volunteers",
      description: "Mobile-first logistics console with batched pickup routes, digital safety inspection, simulated QR scanner, and OTP pad.",
      actionLabel: "Launch Driver App →",
      badge: "₹12/km Payout",
    },
    {
      key: "enterprise",
      path: "/enterprise",
      emoji: "🏢",
      title: "Enterprise CSR",
      subtitle: "Corporate Sustainability & 80G Receipts",
      description: "Audited ESG metrics, interactive monthly meal delivery charts, CO₂e reduction reporting, and downloadable 80G tax certificates.",
      actionLabel: "View CSR Impact →",
      badge: "ESG & Tax Exemption",
    },
    {
      key: "admin",
      path: "/admin",
      emoji: "🛰",
      title: "Admin System Map",
      subtitle: "Real-Time Fleet & Network Telemetry",
      description: "Dark-mode mission control map featuring animated transit vectors, pulsing donor nodes, live activity feed, and FHRI reliability tables.",
      actionLabel: "Open Control Room →",
      badge: "Live Telemetry",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/70 via-slate-50 to-white text-ink selection:bg-brand-500 selection:text-white">
      {/* Top Navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white shadow-sm border border-brand-100 flex items-center justify-center text-2xl">
            🌉
          </div>
          <div>
            <span className="font-heading font-black text-xl tracking-tight text-ink flex items-center gap-1">
              Meal<span className="text-brand-600">Bridge</span>
            </span>
            <span className="block text-[10px] font-bold text-brand-700 tracking-wider uppercase">
              Phase 1 Prototype
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/donor"
            className="text-xs font-semibold text-slate-600 hover:text-ink px-3 py-1.5 transition-colors hidden sm:block"
          >
            Launch Demo
          </Link>
          <Button
            size="sm"
            onClick={() => handleSelectRole('donor', '/donor')}
            className="rounded-full shadow-xs"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 pt-12 pb-16 text-center">
        {/* Floating Minimalist Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-brand-200/80 shadow-xs mb-8 text-xs font-semibold text-brand-800 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          Connecting Surplus Food with Real Need through Smart Logistics
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading text-ink tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Turn today's surplus into <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-700">tonight's warm meal.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          MealBridge solves food rescue inefficiency using algorithmic priority matching, thermal-aware decay modeling, dual OTP handshakes, and tamper-evident packaging.
        </p>

        {/* Impact Stat Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-slate-700">
          <div className="px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
            <span>🍽</span>
            <span><strong>12,840</strong> meals delivered</span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
            <span>🌍</span>
            <span><strong>10.7 t</strong> CO₂e saved</span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
            <span>🤝</span>
            <span><strong>4</strong> verified partners</span>
          </div>
        </div>
      </section>

      {/* Role Selection Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-ink">
            Explore All 5 Interactive Roles
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Select any persona to experience the end-to-end food rescue lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((r) => (
            <div
              key={r.key}
              onClick={() => handleSelectRole(r.key, r.path)}
              className="group cursor-pointer rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {r.emoji}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                    {r.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-heading text-ink group-hover:text-brand-600 transition-colors">
                  {r.title}
                </h3>
                <p className="text-xs font-semibold text-brand-700 mt-0.5 mb-3">
                  {r.subtitle}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {r.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-600 group-hover:translate-x-1 transition-transform">
                <span>{r.actionLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4-Step Lifecycle */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="rounded-3xl bg-white border border-slate-200/90 p-8 md:p-12 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-center text-ink mb-10">
            How The MealBridge Protocol Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative">
            {[
              { step: "01", title: "Post Surplus", desc: "Commercial kitchens input weight, category, and safe preparation window with live freshness index.", icon: "🍲" },
              { step: "02", title: "Max-Heap Match", desc: "Binary Max-Heap ranks nearby verified NGOs by proximity (40%), decay index (35%), and headcount fit (25%).", icon: "🎯" },
              { step: "03", title: "Pickup OTP", desc: "Driver conducts 3-point digital safety checklist and enters the donor's 4-digit Passcard OTP.", icon: "🔐" },
              { step: "04", title: "Dropoff OTP", desc: "NGO manager validates temperature integrity and verifies delivery with the dropoff OTP.", icon: "✅" },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-2xl mb-3 shadow-xs">
                  {s.icon}
                </div>
                <span className="text-[10px] font-bold text-brand-600 tracking-widest uppercase mb-1">
                  Step {s.step}
                </span>
                <h4 className="font-heading font-bold text-sm text-ink mb-1.5">{s.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <p className="font-medium">
          MealBridge • ISE IDT Project • Phase 1 Prototype (Hardcoded Demo Data)
        </p>
      </footer>
    </div>
  );
}
