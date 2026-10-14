import React from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { DemoPanel } from './DemoPanel';

export function AppShell() {
  const { role, setRole, currentDonorId, currentNgoId, getDonor, getNgo } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const donor = getDonor(currentDonorId);
  const ngo = getNgo(currentNgoId);

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    if (newRole === 'donor') navigate('/donor');
    else if (newRole === 'recipient') navigate('/recipient');
    else if (newRole === 'driver') navigate('/driver');
    else if (newRole === 'enterprise') navigate('/enterprise');
    else if (newRole === 'admin') navigate('/admin');
  };

  // Determine current active role from path
  const currentPath = location.pathname;
  let activeRole = 'donor';
  if (currentPath.startsWith('/recipient')) activeRole = 'recipient';
  else if (currentPath.startsWith('/driver')) activeRole = 'driver';
  else if (currentPath.startsWith('/enterprise')) activeRole = 'enterprise';
  else if (currentPath.startsWith('/admin')) activeRole = 'admin';

  return (
    <div className="min-h-screen bg-slate-50 text-ink flex flex-col antialiased">
      {/* Top Floating Glass Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-xl shadow-xs transition-transform group-hover:scale-105">
              🌉
            </div>
            <div>
              <span className="font-heading font-black text-lg tracking-tight text-ink flex items-center gap-1">
                Meal<span className="text-brand-600">Bridge</span>
              </span>
              <span className="block text-[10px] font-medium text-slate-400 tracking-wide uppercase">
                Smart Food Logistics
              </span>
            </div>
          </Link>

          {/* Role-Specific Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
            {activeRole === 'donor' && (
              <>
                <NavLink
                  to="/donor"
                  end
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive ? "bg-white text-brand-700 shadow-xs" : "text-slate-600 hover:text-ink"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/donor/new"
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive ? "bg-white text-brand-700 shadow-xs" : "text-slate-600 hover:text-ink"
                    }`
                  }
                >
                  + New Donation
                </NavLink>
                <NavLink
                  to="/donor/history"
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive ? "bg-white text-brand-700 shadow-xs" : "text-slate-600 hover:text-ink"
                    }`
                  }
                >
                  History
                </NavLink>
              </>
            )}

            {activeRole === 'recipient' && (
              <>
                <NavLink
                  to="/recipient"
                  end
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white text-brand-700 shadow-xs"
                >
                  Available Listings & Claims
                </NavLink>
              </>
            )}

            {activeRole === 'enterprise' && (
              <>
                <NavLink
                  to="/enterprise"
                  end
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white text-brand-700 shadow-xs"
                >
                  CSR Impact Dashboard
                </NavLink>
              </>
            )}
          </nav>

          {/* Role Switcher & Active Entity pill */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium bg-slate-100/60 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700">
              {activeRole === 'donor' ? (
                <>
                  <span>{donor?.emoji || "🏨"}</span>
                  <span className="font-semibold">{donor?.name}</span>
                </>
              ) : activeRole === 'recipient' ? (
                <>
                  <span>{ngo?.emoji || "🏠"}</span>
                  <span className="font-semibold">{ngo?.name}</span>
                </>
              ) : activeRole === 'driver' ? (
                <>
                  <span>🚚</span>
                  <span className="font-semibold">Ravi Kumar</span>
                </>
              ) : (
                <>
                  <span>🏢</span>
                  <span className="font-semibold">TechNova CSR</span>
                </>
              )}
            </div>

            {/* Quick Role Switcher Dropdown */}
            <select
              value={activeRole}
              onChange={handleRoleChange}
              className="text-xs font-semibold bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="donor">🏨 Donor Portal</option>
              <option value="recipient">🏠 Recipient NGO</option>
              <option value="driver">🚚 Driver App</option>
              <option value="enterprise">🏢 Enterprise CSR</option>
              <option value="admin">🛰 Admin Console</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <Outlet />
      </main>

      {/* Floating Demo Control Panel */}
      <DemoPanel />
    </div>
  );
}
