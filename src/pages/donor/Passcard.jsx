import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, STATUS } from '../../utils/constants';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusChip } from '../../components/ui/StatusChip';
import { FreshnessRing } from '../../components/FreshnessRing';
import { UrgencyBadge } from '../../components/UrgencyBadge';
import { driver } from '../../data/mockData';

export function Passcard() {
  const { postId } = useParams();
  const { posts, getNgo, getDecay, getBand, bestNgoFor } = useApp();

  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <span className="text-4xl">🔍</span>
        <h2 className="text-xl font-bold font-heading text-ink mt-3">Donation Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          This donation may have been reset or does not exist.
        </p>
        <Link to="/donor">
          <Button size="sm">Back to Donor Dashboard</Button>
        </Link>
      </div>
    );
  }

  const category = CATEGORIES[post.category] || CATEGORIES.cooked;
  const decay = getDecay(post);
  const band = getBand(post);

  // Determine recipient NGO (claimed or best algorithmic match)
  const claimedNgo = post.claimedBy ? getNgo(post.claimedBy) : null;
  const matchResult = bestNgoFor(post);
  const targetNgo = claimedNgo || matchResult.ngo;

  return (
    <div className="max-w-md mx-auto space-y-4 animate-fadeIn">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/donor"
          className="text-xs font-semibold text-slate-500 hover:text-ink flex items-center gap-1 transition-colors"
        >
          ← Back to Donor Portal
        </Link>
        <span className="text-xs font-mono text-slate-400">ID: {post.id}</span>
      </div>

      {/* Ticket-style Passcard */}
      <Card className="p-6 border-slate-200 shadow-xl overflow-hidden relative bg-white">
        {/* Ticket Header */}
        <div className="flex items-start justify-between pb-4 border-b border-dashed border-slate-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{category.emoji}</span>
            <div>
              <h2 className="text-lg font-bold font-heading text-ink leading-tight">
                {post.title}
              </h2>
              <p className="text-xs text-slate-500">{category.label}</p>
            </div>
          </div>
          <StatusChip status={post.status} />
        </div>

        {/* QR Code Section */}
        <div className="py-6 flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs">
            <QRCodeSVG
              value={`MEALBRIDGE|POST:${post.id}|PICKUP`}
              size={180}
              level="H"
              includeMargin={false}
            />
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-2">
            SCAN CODE • MEALBRIDGE-PASS-V1
          </span>
        </div>

        {/* 4-Digit Pickup OTP Box */}
        <div className="mb-6 p-4 rounded-2xl bg-brand-50/70 border border-brand-200 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-900 mb-2">
            4-Digit Pickup OTP
          </p>
          <div className="flex justify-center gap-3">
            {post.pickupOtp.split('').map((char, index) => (
              <div
                key={index}
                className="w-12 h-14 rounded-2xl bg-white border-2 border-brand-500 shadow-xs flex items-center justify-center font-heading font-extrabold text-2xl text-ink"
              >
                {char}
              </div>
            ))}
          </div>
          <p className="text-[11px] font-medium text-brand-700 mt-2">
            Show this OTP to the delivery driver at handover
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs mb-4">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Quantity</span>
            <span className="font-heading font-extrabold text-ink text-sm">
              {post.weightKg} kg (≈ {post.meals} meals)
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Storage</span>
            <span className="font-semibold text-ink text-xs">{category.storage}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Packaging Kit</span>
            <span className="font-semibold text-ink text-xs">
              {post.kitRequested ? "✓ Requested (Sealed)" : "Standard Container"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Freshness Band</span>
            <div className="mt-0.5">
              <UrgencyBadge band={band} />
            </div>
          </div>
        </div>

        {/* Status-Dependent Info Banner */}
        <div className="text-xs p-3.5 rounded-2xl border font-medium mb-4">
          {post.status === STATUS.POSTED && (
            <div className="text-slate-700 flex items-center gap-2">
              <span className="animate-spin text-base">🔎</span>
              <span>Algorithmically finding the best recipient shelter…</span>
            </div>
          )}

          {post.status === STATUS.ALGORITHMICALLY_MATCHED && (
            <div className="text-violet-900 bg-violet-50 -m-3.5 p-3.5 rounded-2xl border border-violet-200">
              🎯 <strong>Matched with {targetNgo?.name}!</strong> Driver dispatch pending.
            </div>
          )}

          {post.status === STATUS.CLAIMED && (
            <div className="text-blue-900 bg-blue-50 -m-3.5 p-3.5 rounded-2xl border border-blue-200 flex items-center justify-between">
              <div>
                <p>✅ <strong>Claimed by {claimedNgo?.name || "NGO"}</strong></p>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  Driver assigned: {driver.name} • ETA ~18 min
                </p>
              </div>
              <a
                href={`tel:${driver.phone}`}
                className="px-2.5 py-1 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
              >
                📞 Call
              </a>
            </div>
          )}

          {post.status === STATUS.IN_TRANSIT && (
            <div className="text-amber-900 bg-amber-50 -m-3.5 p-3.5 rounded-2xl border border-amber-200">
              🚚 <strong>Food Picked Up:</strong> Driver is on the way to {claimedNgo?.name}.
            </div>
          )}

          {post.status === STATUS.DELIVERED_VERIFIED && (
            <div className="text-green-900 bg-green-50 -m-3.5 p-3.5 rounded-2xl border border-green-200">
              🎉 <strong>Delivered & Verified:</strong> Recipient verified via Dropoff OTP.
            </div>
          )}

          {post.status === STATUS.EXPIRED_AUTOMATED_PURGE && (
            <div className="text-red-900 bg-red-50 -m-3.5 p-3.5 rounded-2xl border border-red-200">
              ⛔ <strong>Auto-Purged:</strong> Freshness limit exceeded (Dᵢ ≥ 1.0). For food safety, please do not hand over this food.
            </div>
          )}
        </div>

        {/* Footer disclaimer */}
        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
          Handover is covered by the MealBridge digital liability waiver you accepted.
        </p>
      </Card>
    </div>
  );
}
