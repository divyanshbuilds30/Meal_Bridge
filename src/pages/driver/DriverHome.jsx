import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { STATUS, PAYOUT_PER_KM_INR, CATEGORIES } from '../../utils/constants';
import { driver } from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { RouteTimeline } from '../../components/RouteTimeline';
import { UrgencyBadge } from '../../components/UrgencyBadge';
import { StatusChip } from '../../components/ui/StatusChip';

export function DriverHome() {
  const { jobs, posts, getDonor, getNgo, getBand, acceptJob } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('available');
  const [selectedJobForChecklist, setSelectedJobForChecklist] = useState(null);

  // 3-point checklist state
  const [chk1, setChk1] = useState(false);
  const [chk2, setChk2] = useState(false);
  const [chk3, setChk3] = useState(false);

  // Filter jobs
  const availableJobs = jobs.filter(
    (j) => j.driverId === null && j.status === STATUS.CLAIMED
  );
  const activeJobs = jobs.filter(
    (j) => j.driverId === "dr1" && (j.status === STATUS.CLAIMED || j.status === STATUS.IN_TRANSIT)
  );

  const openChecklistModal = (job) => {
    setSelectedJobForChecklist(job);
    setChk1(false);
    setChk2(false);
    setChk3(false);
  };

  const handleStartJob = () => {
    if (!selectedJobForChecklist) return;
    acceptJob(selectedJobForChecklist.id);
    const jId = selectedJobForChecklist.id;
    setSelectedJobForChecklist(null);
    navigate(`/driver/job/${jId}`);
  };

  // Check if current selected job has coldChain items
  const selectedJobPosts = selectedJobForChecklist
    ? posts.filter((p) => selectedJobForChecklist.postIds.includes(p.id))
    : [];
  const hasColdChain = selectedJobPosts.some(
    (p) => CATEGORIES[p.category]?.coldChain
  );

  return (
    <div className="p-4 space-y-4">
      {/* Driver Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-xl">
            👨‍✈️
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-base text-ink">
              Hi, {driver.name} 👋
            </h1>
            <p className="text-[11px] text-slate-500">
              ⭐ {driver.rating} rating • {driver.vehicle}
            </p>
          </div>
        </div>

        <div className="bg-brand-50 border border-brand-200 text-brand-800 px-3 py-1 rounded-full text-xs font-bold font-mono">
          Today: ₹{driver.earningsToday}
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('available')}
          className={`py-2 rounded-lg transition-all ${
            activeTab === 'available'
              ? "bg-white text-ink shadow-xs"
              : "text-slate-500 hover:text-ink"
          }`}
        >
          Available ({availableJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`py-2 rounded-lg transition-all ${
            activeTab === 'active'
              ? "bg-white text-ink shadow-xs"
              : "text-slate-500 hover:text-ink"
          }`}
        >
          Active Tasks ({activeJobs.length})
        </button>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {activeTab === 'available' ? (
          availableJobs.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100 p-6">
              <span className="text-4xl">🛵</span>
              <h4 className="font-heading font-bold text-sm text-ink mt-2">No jobs available right now</h4>
              <p className="text-xs text-slate-500 mt-1">
                New batches claimed by NGOs will appear here instantly.
              </p>
            </div>
          ) : (
            availableJobs.map((job) => {
              const jobPosts = posts.filter((p) => job.postIds.includes(p.id));
              const ngo = getNgo(job.ngoId);
              const totalMeals = jobPosts.reduce((acc, p) => acc + p.meals, 0);
              const payout = Math.round(job.routeKm * PAYOUT_PER_KM_INR);

              // Max urgency badge
              let maxBand = 'fresh';
              for (const p of jobPosts) {
                const b = getBand(p);
                if (b === 'critical') {
                  maxBand = 'critical';
                  break;
                }
                if (b === 'urgent') maxBand = 'urgent';
              }

              // Build stops for timeline
              const stops = jobPosts.map((p) => {
                const donor = getDonor(p.donorId);
                return {
                  type: 'pickup',
                  label: donor?.name || "Donor",
                  subtext: `${p.title} (${p.weightKg} kg)`,
                };
              });
              stops.push({
                type: 'drop',
                label: ngo?.name || "NGO",
                subtext: `Total ${totalMeals} meals delivery`,
              });

              return (
                <Card key={job.id} className="p-4 space-y-3 border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      JOB #{job.id}
                    </span>
                    <div className="flex items-center gap-2">
                      <UrgencyBadge band={maxBand} />
                      <span className="text-xs font-heading font-extrabold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                        ₹{payout}
                      </span>
                    </div>
                  </div>

                  <RouteTimeline stops={stops} />

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Badge variant="slate">{job.routeKm} km</Badge>
                      <Badge variant="brand">≈ {totalMeals} meals</Badge>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => openChecklistModal(job)}
                    >
                      Accept Job →
                    </Button>
                  </div>
                </Card>
              );
            })
          )
        ) : (
          /* Active tab */
          activeJobs.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100 p-6">
              <span className="text-4xl">🏁</span>
              <h4 className="font-heading font-bold text-sm text-ink mt-2">No active jobs in progress</h4>
              <p className="text-xs text-slate-500 mt-1 mb-3">
                Check available jobs tab to accept delivery batches.
              </p>
              <Button size="sm" onClick={() => setActiveTab('available')}>
                Browse Available Jobs
              </Button>
            </div>
          ) : (
            activeJobs.map((job) => {
              const jobPosts = posts.filter((p) => job.postIds.includes(p.id));
              const ngo = getNgo(job.ngoId);
              const totalMeals = jobPosts.reduce((acc, p) => acc + p.meals, 0);
              const payout = Math.round(job.routeKm * PAYOUT_PER_KM_INR);

              return (
                <Card key={job.id} className="p-4 space-y-3 border-brand-200 bg-brand-50/20">
                  <div className="flex items-center justify-between">
                    <StatusChip status={job.status} />
                    <span className="text-xs font-heading font-extrabold text-brand-700">
                      Earns ₹{payout}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-sm text-ink">
                      Destination: {ngo?.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {jobPosts.length} pickup stop(s) • Total {totalMeals} meals
                    </p>
                  </div>

                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/driver/job/${job.id}`)}
                  >
                    Continue Delivery Console →
                  </Button>
                </Card>
              );
            })
          )
        )}
      </div>

      {/* Safety Inspection Checklist Modal */}
      <Modal
        open={Boolean(selectedJobForChecklist)}
        onClose={() => setSelectedJobForChecklist(null)}
        title="3-Point Food Safety Inspection"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            As an authorized MealBridge partner, verify the physical criteria below before accepting custody of this food batch:
          </p>

          <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            {/* Point 1 */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={chk1}
                onChange={(e) => setChk1(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-brand-600 rounded cursor-pointer shrink-0"
              />
              <span className="text-slate-800 font-medium">
                1. Food is enclosed in a sealed, tamper-evident MealBridge box or certified container.
              </span>
            </label>

            {/* Point 2 */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={chk2}
                onChange={(e) => setChk2(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-brand-600 rounded cursor-pointer shrink-0"
              />
              <span className="text-slate-800 font-medium">
                2. Food looks fresh and wholesome — no off-odour, gas swelling, or visible discolouration.
              </span>
            </label>

            {/* Point 3 */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={chk3}
                onChange={(e) => setChk3(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-brand-600 rounded cursor-pointer shrink-0"
              />
              <span className="text-slate-800 font-medium">
                {hasColdChain
                  ? "3. Temperature tag confirms cold chain compliance (4°C – 10°C)."
                  : "3. Digital freshness meter shows below 100% (within safe preparation window)."}
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedJobForChecklist(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!chk1 || !chk2 || !chk3}
              onClick={handleStartJob}
            >
              Start Job →
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
