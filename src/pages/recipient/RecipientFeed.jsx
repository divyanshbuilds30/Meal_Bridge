import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, STATUS } from '../../utils/constants';
import { MaxHeap } from '../../utils/maxHeap';
import { ListingCard } from '../../components/ListingCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusChip } from '../../components/ui/StatusChip';
import { StatusStepper } from '../../components/StatusStepper';

export function RecipientFeed() {
  const {
    currentNgoId,
    getNgo,
    posts,
    jobs,
    getBand,
    getPriorityFor,
    ngoHeadcount,
    setHeadcount,
  } = useApp();

  const [activeTab, setActiveTab] = useState('available');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [onlyCompatible, setOnlyCompatible] = useState(true);

  const ngo = getNgo(currentNgoId);
  const headcount = ngoHeadcount[currentNgoId] || 50;

  // Filter available posts: POSTED or ALGORITHMICALLY_MATCHED, not expired
  const eligiblePosts = posts.filter((p) => {
    const isEligibleStatus =
      p.status === STATUS.POSTED || p.status === STATUS.ALGORITHMICALLY_MATCHED;
    const band = getBand(p);
    return isEligibleStatus && band !== 'expired';
  });

  // Count auto-purged posts for notification badge
  const autoPurgedCount = posts.filter(
    (p) => p.status === STATUS.EXPIRED_AUTOMATED_PURGE
  ).length;

  // Build binary Max-Heap based on Priority Score P
  const heap = new MaxHeap();
  eligiblePosts.forEach((post) => {
    const priority = getPriorityFor(post, currentNgoId);
    heap.push({ ...post, priority });
  });

  const rankedPosts = heap.toSortedArray();

  // Apply Category & Compatibility filters
  const filteredPosts = rankedPosts.filter((post) => {
    if (selectedCategory !== 'all' && post.category !== selectedCategory) {
      return false;
    }
    if (onlyCompatible && post.meals < 0.5 * headcount) {
      return false;
    }
    return true;
  });

  // My claims: jobs where ngoId === currentNgoId
  const myClaims = jobs.filter((j) => j.ngoId === currentNgoId);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{ngo?.emoji || "🏠"}</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-ink">
              {ngo?.name}
            </h1>
            <p className="text-xs font-semibold text-brand-700 tracking-wide uppercase">
              {ngo?.type} • Verified Recipient Partner
            </p>
          </div>
        </div>

        {/* Tabs Switcher */}
        <div className="flex items-center p-1 bg-slate-200/70 rounded-2xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'available'
                ? "bg-white text-ink shadow-xs"
                : "text-slate-600 hover:text-ink"
            }`}
          >
            Available Listings ({eligiblePosts.length})
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'claims'
                ? "bg-white text-ink shadow-xs"
                : "text-slate-600 hover:text-ink"
            }`}
          >
            My Claims ({myClaims.length})
          </button>
        </div>
      </div>

      {activeTab === 'available' ? (
        <div className="space-y-6">
          {/* Controls Bar */}
          <Card className="p-4 bg-white/90 backdrop-blur-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Capacity Headcount Stepper */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">Feeding:</span>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setHeadcount(currentNgoId, headcount - 5)}
                    className="w-7 h-7 rounded-lg bg-white shadow-xs hover:bg-slate-100 font-bold text-slate-700 flex items-center justify-center text-sm"
                  >
                    −
                  </button>
                  <span className="font-heading font-extrabold text-sm text-ink px-2 w-16 text-center">
                    {headcount} ppl
                  </span>
                  <button
                    type="button"
                    onClick={() => setHeadcount(currentNgoId, headcount + 5)}
                    className="w-7 h-7 rounded-lg bg-white shadow-xs hover:bg-slate-100 font-bold text-slate-700 flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Compatibility Toggle */}
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={onlyCompatible}
                  onChange={(e) => setOnlyCompatible(e.target.checked)}
                  className="w-4 h-4 accent-brand-600 rounded cursor-pointer"
                />
                <span>Only compatible listings (≥ 50% headcount)</span>
              </label>

              {/* Ranking Tooltip note */}
              <div
                className="text-xs text-slate-500 flex items-center gap-1 cursor-help"
                title="Ranked by Max-Heap priority score P = 0.40·proximity + 0.35·urgency + 0.25·portion match."
              >
                <span>Ranked by best match</span>
                <span className="w-4 h-4 rounded-full bg-slate-100 border border-slate-300 text-[10px] font-bold flex items-center justify-center text-slate-600">
                  ⓘ
                </span>
              </div>
            </div>

            {/* Category filter pills */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-400 mr-1">Filter:</span>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === 'all'
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Food Types
              </button>
              {Object.values(CATEGORIES).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? "bg-brand-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Auto-purged Safety Alert Banner */}
          {autoPurgedCount > 0 && (
            <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                <span>🛡️</span>
                <span><strong>{autoPurgedCount} listing(s)</strong> auto-delisted by safety protocol (Dᵢ ≥ 1.0 limit exceeded).</span>
              </span>
              <span className="text-[11px] font-bold text-slate-500 uppercase">FSM Safety Intercept</span>
            </div>
          )}

          {/* Feed listings */}
          {filteredPosts.length === 0 ? (
            <Card className="text-center py-16">
              <span className="text-4xl">🥘</span>
              <h3 className="text-base font-bold text-ink mt-3">No compatible listings found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Try unchecking "Only compatible listings" or selecting "All Food Types".
              </p>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setOnlyCompatible(false);
                  setSelectedCategory('all');
                }}
              >
                Reset Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredPosts.map((post, index) => (
                <ListingCard
                  key={post.id}
                  post={post}
                  isTopMatch={index === 0}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* My Claims Tab */
        <div className="space-y-4">
          {myClaims.length === 0 ? (
            <Card className="text-center py-16">
              <span className="text-4xl">📦</span>
              <h3 className="text-base font-bold text-ink mt-3">No active or past claims</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Explore available surplus food batches and lock them for your shelter.
              </p>
              <Button size="sm" onClick={() => setActiveTab('available')}>
                View Available Listings
              </Button>
            </Card>
          ) : (
            myClaims.map((job) => {
              const jobPosts = posts.filter((p) => job.postIds.includes(p.id));
              const titles = jobPosts.map((p) => p.title).join(" + ");
              const totalMeals = jobPosts.reduce((acc, p) => acc + p.meals, 0);

              let currentStage = 1;
              if (job.status === STATUS.CLAIMED && !job.driverId) currentStage = 1;
              else if (job.status === STATUS.CLAIMED && job.driverId) currentStage = 2;
              else if (job.status === STATUS.IN_TRANSIT) currentStage = 3;
              else if (job.status === STATUS.DELIVERED_VERIFIED) currentStage = 4;

              return (
                <Card key={job.id} className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                          JOB #{job.id}
                        </span>
                        <StatusChip status={job.status} />
                      </div>
                      <h3 className="font-heading font-bold text-base text-ink mt-1">
                        {titles || "Claimed Batch"}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Total {totalMeals} meals • Route: {job.routeKm} km
                      </p>
                    </div>

                    <Link to={`/recipient/tracking/${job.id}`}>
                      <Button size="sm">
                        Live Tracking & Dropoff OTP →
                      </Button>
                    </Link>
                  </div>

                  <div className="pt-2">
                    <StatusStepper stage={currentStage} />
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
