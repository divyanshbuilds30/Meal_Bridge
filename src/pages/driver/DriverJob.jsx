import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { STATUS, PAYOUT_PER_KM_INR, CATEGORIES } from '../../utils/constants';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FreshnessRing } from '../../components/FreshnessRing';
import { QrScannerSim } from '../../components/QrScannerSim';
import { OtpPad } from '../../components/OtpPad';

export function DriverJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const {
    jobs,
    posts,
    getDonor,
    getNgo,
    getDecay,
    verifyPickup,
    verifyDropoff,
  } = useApp();

  const job = jobs.find((j) => j.id === jobId);

  // Track simulated scanner vs OTP view for current stop
  const [showOtpForStop, setShowOtpForStop] = useState({});

  if (!job) {
    return (
      <div className="p-6 text-center">
        <h3 className="font-bold text-ink text-base">Job not found</h3>
        <Link to="/driver">
          <Button size="sm" className="mt-3">Back to Driver Home</Button>
        </Link>
      </div>
    );
  }

  const ngo = getNgo(job.ngoId);
  const jobPosts = posts.filter((p) => job.postIds.includes(p.id));
  const totalMeals = jobPosts.reduce((acc, p) => acc + p.meals, 0);
  const payout = Math.round(job.routeKm * PAYOUT_PER_KM_INR);

  // Determine current active stop among pickups
  const activePickupStop = jobPosts.find(
    (p) => !p.pickedUp && p.status !== STATUS.EXPIRED_AUTOMATED_PURGE
  );

  const allPickupsDone = jobPosts.every(
    (p) => p.pickedUp || p.status === STATUS.EXPIRED_AUTOMATED_PURGE
  );

  const isDelivered = job.status === STATUS.DELIVERED_VERIFIED;
  const isInTransit = job.status === STATUS.IN_TRANSIT || allPickupsDone;

  const handleVerifyPickupOtp = (code, postId) => {
    return verifyPickup(job.id, postId, code);
  };

  const handleVerifyDropoffOtp = (code) => {
    return verifyDropoff(job.id, code);
  };

  // If already delivered, render success summary
  if (isDelivered) {
    return (
      <div className="p-6 flex flex-col items-center justify-center text-center min-h-[500px] animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-4xl font-black mb-4 shadow-sm animate-bounce">
          ✓
        </div>
        <h2 className="text-2xl font-extrabold font-heading text-ink">
          Delivered & Verified!
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Handover successfully completed at {ngo?.name}. Good Samaritan chain of custody verified.
        </p>

        <div className="my-6 w-full p-4 rounded-2xl bg-brand-50 border border-brand-200 text-center">
          <p className="text-xs font-semibold text-brand-800 uppercase tracking-wider">
            Job Earnings Credited
          </p>
          <p className="text-3xl font-black font-heading text-brand-700 mt-0.5">
            ₹{payout}
          </p>
          <p className="text-[11px] text-brand-600 mt-1">
            {totalMeals} meals safely rescued & delivered
          </p>
        </div>

        <Button onClick={() => navigate('/driver')} className="w-full">
          Back to Jobs List
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Link
            to="/driver"
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
          >
            ←
          </Link>
          <div>
            <span className="font-heading font-extrabold text-sm text-ink block">
              Delivery Job #{job.id}
            </span>
            <span className="text-[11px] text-slate-400">
              {isInTransit ? "Phase B: Delivery Dropoff" : "Phase A: Commercial Pickups"}
            </span>
          </div>
        </div>

        <span className="text-xs font-heading font-extrabold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
          Payout: ₹{payout}
        </span>
      </div>

      {/* Phase A: Pickup Stops */}
      {!isInTransit && (
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pickup Stops ({jobPosts.filter((p) => p.pickedUp).length}/{jobPosts.length} Completed)
          </p>

          {jobPosts.map((post, index) => {
            const donor = getDonor(post.donorId);
            const cat = CATEGORIES[post.category] || CATEGORIES.cooked;
            const decay = getDecay(post);
            const isCurrent = activePickupStop && activePickupStop.id === post.id;
            const isPurged = post.status === STATUS.EXPIRED_AUTOMATED_PURGE;

            return (
              <Card
                key={post.id}
                className={`p-4 transition-all ${
                  post.pickedUp
                    ? "bg-slate-50 border-slate-200 opacity-80"
                    : isCurrent
                    ? "border-brand-500 shadow-md ring-2 ring-brand-100"
                    : "border-slate-200"
                }`}
              >
                {/* Stop Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        post.pickedUp
                          ? "bg-brand-600 text-white"
                          : isCurrent
                          ? "bg-brand-500 text-white animate-pulse"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {post.pickedUp ? "✓" : index + 1}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-ink leading-tight">
                        {donor?.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">{donor?.type} Partner</p>
                    </div>
                  </div>

                  <FreshnessRing value={decay} size={36} strokeWidth={4} showLabel={false} />
                </div>

                <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-ink">{cat.emoji} {post.title}</span>
                  <span className="text-brand-700 font-bold">{post.weightKg} kg (≈ {post.meals} meals)</span>
                </div>

                {/* Navigation and Call Action Buttons */}
                <div className="flex gap-2 mt-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      donor?.name || ""
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-center text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    🧭 Navigate
                  </a>
                  <a
                    href={`tel:${donor?.phone || ""}`}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-center text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    📞 Call Donor
                  </a>
                </div>

                {/* Expired note */}
                {isPurged && (
                  <div className="mt-3 p-2 rounded-xl bg-red-50 border border-red-200 text-center text-xs font-bold text-critical">
                    ⛔ Expired — Skip Stop (Safety Auto-Purge)
                  </div>
                )}

                {/* Current Active Verification View */}
                {isCurrent && !isPurged && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                    {!showOtpForStop[post.id] ? (
                      <div className="space-y-3">
                        <QrScannerSim
                          title={post.title}
                          onScanned={() =>
                            setShowOtpForStop((prev) => ({ ...prev, [post.id]: true }))
                          }
                        />
                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() =>
                              setShowOtpForStop((prev) => ({ ...prev, [post.id]: true }))
                            }
                            className="text-xs text-slate-500 hover:text-brand-700 underline font-medium"
                          >
                            Or enter 4-digit Pickup OTP directly →
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <OtpPad
                          title={`Enter Pickup OTP from ${donor?.name}`}
                          onSubmit={(code) => handleVerifyPickupOtp(code, post.id)}
                        />
                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() =>
                              setShowOtpForStop((prev) => ({ ...prev, [post.id]: false }))
                            }
                            className="text-xs text-slate-500 hover:text-ink underline font-medium"
                          >
                            ← Back to QR Camera Viewfinder
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Phase B: Delivery Dropoff */}
      {isInTransit && (
        <Card className="p-5 border-brand-300 bg-brand-50/20 space-y-5">
          <div className="text-center pb-2 border-b border-slate-100">
            <span className="text-3xl">🚚</span>
            <h3 className="font-heading font-extrabold text-base text-ink mt-1">
              In Transit to {ngo?.name}
            </h3>
            <p className="text-xs text-slate-500">
              Total {totalMeals} meals ready for delivery handover
            </p>
          </div>

          <div className="flex gap-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                ngo?.name || ""
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-center text-xs font-semibold transition-colors flex items-center justify-center gap-1"
            >
              🧭 Navigate to Shelter
            </a>
            <a
              href={`tel:${ngo?.phone || ""}`}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-center text-xs font-semibold transition-colors flex items-center justify-center gap-1"
            >
              📞 Call Recipient
            </a>
          </div>

          {/* Dropoff OTP verification */}
          <div className="pt-2">
            <OtpPad
              title={`Enter Dropoff OTP from ${ngo?.name} Manager`}
              onSubmit={handleVerifyDropoffOtp}
            />
          </div>
        </Card>
      )}
    </div>
  );
}
