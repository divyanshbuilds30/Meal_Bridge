import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { STATUS, CATEGORIES } from '../../utils/constants';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusStepper } from '../../components/StatusStepper';
import { UrgencyBadge } from '../../components/UrgencyBadge';
import { StatusChip } from '../../components/ui/StatusChip';
import { driver } from '../../data/mockData';

export function RecipientTracking() {
  const { jobId } = useParams();
  const { jobs, posts, getNgo, getDonor, getBand } = useApp();

  const job = jobs.find((j) => j.id === jobId);

  if (!job) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <span className="text-4xl">🔍</span>
        <h2 className="text-xl font-bold font-heading text-ink mt-3">Job Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          The requested delivery batch was not found.
        </p>
        <Link to="/recipient">
          <Button size="sm">Back to Recipient Feed</Button>
        </Link>
      </div>
    );
  }

  const ngo = getNgo(job.ngoId);
  const jobPosts = posts.filter((p) => job.postIds.includes(p.id));

  let currentStage = 1;
  if (job.status === STATUS.CLAIMED && !job.driverId) currentStage = 1;
  else if (job.status === STATUS.CLAIMED && job.driverId) currentStage = 2;
  else if (job.status === STATUS.IN_TRANSIT) currentStage = 3;
  else if (job.status === STATUS.DELIVERED_VERIFIED) currentStage = 4;

  const isDriverAssigned = Boolean(job.driverId);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Top back navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <Link
          to="/recipient"
          className="text-xs font-semibold text-slate-500 hover:text-ink flex items-center gap-1 transition-colors"
        >
          ← Back to My Claims
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">JOB #{job.id}</span>
          <StatusChip status={job.status} />
        </div>
      </div>

      {/* Stepper Card */}
      <Card className="p-6">
        <h2 className="text-base font-bold font-heading text-ink mb-4 text-center">
          Live Delivery Lifecycle Tracker
        </h2>
        <StatusStepper stage={currentStage} />
        <p className="text-[11px] text-slate-400 text-center mt-3">
          Status updates automatically in real-time as the driver verifies OTPs in their console.
        </p>
      </Card>

      {/* Dropoff OTP Card */}
      <Card className="p-6 border-brand-200 bg-brand-50/50 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-900 mb-1">
          🔐 Recipient Dropoff Verification OTP
        </p>
        <p className="text-xs text-slate-600 mb-4">
          Provide this 4-digit code to driver <strong>{driver.name}</strong> upon food delivery handover to verify completion.
        </p>

        <div className="flex justify-center gap-3">
          {job.dropoffOtp.split('').map((char, index) => (
            <div
              key={index}
              className="w-14 h-16 rounded-2xl bg-white border-2 border-brand-500 shadow-sm flex items-center justify-center font-heading font-black text-3xl text-ink"
            >
              {char}
            </div>
          ))}
        </div>
      </Card>

      {/* Driver Information Card */}
      <Card className="p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Assigned Logistics Partner
        </h3>

        {isDriverAssigned ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shrink-0">
                🚚
              </div>
              <div>
                <h4 className="font-heading font-bold text-base text-ink">
                  {driver.name}
                </h4>
                <p className="text-xs text-slate-500">
                  ⭐ {driver.rating} rating • {driver.vehicle}
                </p>
              </div>
            </div>

            <a
              href={`tel:${driver.phone}`}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>📞</span> Call Driver
            </a>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500">
            ⏳ Delivery driver will be assigned shortly. Nearby drivers are being notified.
          </div>
        )}
      </Card>

      {/* Items in this batch */}
      <Card className="p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Food Items in this Delivery Batch
        </h3>

        <div className="divide-y divide-slate-100">
          {jobPosts.map((post) => {
            const cat = CATEGORIES[post.category] || CATEGORIES.cooked;
            const donor = getDonor(post.donorId);
            const band = getBand(post);

            return (
              <div key={post.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{cat.emoji}</span>
                  <div>
                    <h5 className="font-bold text-ink text-sm">{post.title}</h5>
                    <p className="text-slate-500">
                      From: {donor?.name} • {post.weightKg} kg (≈ {post.meals} meals)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <UrgencyBadge band={band} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
