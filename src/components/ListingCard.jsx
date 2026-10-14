import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { UrgencyBadge } from './UrgencyBadge';
import { Badge } from './ui/Badge';
import { CATEGORIES } from '../utils/constants';
import { useApp } from '../context/AppContext';

export function ListingCard({ post, isTopMatch = false }) {
  const {
    getDonor,
    getDecay,
    getBand,
    getPriorityFor,
    getFhri,
    currentNgoId,
    ngoHeadcount,
    claimPost,
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);

  const donor = getDonor(post.donorId);
  const decay = getDecay(post);
  const band = getBand(post);
  const priority = getPriorityFor(post, currentNgoId);
  const donorFhri = donor ? getFhri(donor.id) : 0.75;
  const category = CATEGORIES[post.category] || CATEGORIES.cooked;
  const headcount = ngoHeadcount[currentNgoId] || 50;

  const bandBorderColor = {
    fresh: "border-l-fresh",
    urgent: "border-l-urgent",
    critical: "border-l-critical",
    expired: "border-l-slate-400",
  }[band] || "border-l-fresh";

  const bandBarColor = {
    fresh: "bg-fresh",
    urgent: "bg-urgent",
    critical: "bg-critical",
    expired: "bg-slate-400",
  }[band] || "bg-fresh";

  const percentUsed = Math.min(100, Math.round(decay * 100));

  const coveragePercent = Math.min(100, Math.round((post.meals / headcount) * 100));
  const fullyCovers = post.meals >= headcount;

  const handleConfirmClaim = () => {
    claimPost(post.id, currentNgoId);
    setModalOpen(false);
  };

  return (
    <>
      <Card
        className={`relative overflow-hidden border-l-[6px] ${bandBorderColor} transition-all duration-200 hover:shadow-md`}
      >
        {isTopMatch && (
          <div className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-xl shadow-sm tracking-wider uppercase">
            ⭐ Best Match
          </div>
        )}

        {/* Row 1: Title & Urgency */}
        <div className="flex items-start justify-between gap-3 pr-16 sm:pr-20 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{category.emoji}</span>
            <div>
              <h3 className="font-heading font-bold text-ink text-base md:text-lg leading-tight">
                {post.title}
              </h3>
              <p className="text-xs text-slate-500">{category.label}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <UrgencyBadge band={band} />
          <span className="text-xs text-slate-400 font-mono">
            P = {priority.toFixed(3)}
          </span>
        </div>

        {/* Freshness Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Freshness used: <strong className="text-slate-800">{percentUsed}%</strong></span>
            <span className="text-[11px] text-slate-400">Limit: 100%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full ${bandBarColor} transition-all duration-500 rounded-full`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
        </div>

        {/* Meta Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3 text-xs">
          <Badge variant="brand">{post.weightKg} kg</Badge>
          <Badge variant="slate">≈ {post.meals} meals</Badge>
          <Badge variant="slate">{category.storage}</Badge>
          {category.coldChain && (
            <Badge variant="amber">❄ Cold Chain</Badge>
          )}
        </div>

        {/* Donor & Headcount Row */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <span>{donor?.emoji || "🏨"}</span>
            <span className="font-medium text-ink">{donor?.name || "Donor"}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">FHRI {donorFhri.toFixed(2)}</span>
          </div>

          <div className="text-xs font-medium">
            {fullyCovers ? (
              <span className="text-fresh font-semibold">✓ Fully covers your headcount ({headcount})</span>
            ) : (
              <span className="text-slate-600">
                Covers <strong className="text-ink">{coveragePercent}%</strong> of headcount ({post.meals}/{headcount})
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 flex items-center justify-end">
          <Button
            size="sm"
            onClick={() => setModalOpen(true)}
            className="w-full sm:w-auto"
          >
            Claim & Lock Batch →
          </Button>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Food Claim"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <span className="text-3xl">{category.emoji}</span>
            <div>
              <h4 className="font-bold text-ink text-sm">{post.title}</h4>
              <p className="text-xs text-slate-500">
                {post.weightKg} kg • {post.meals} meals from {donor?.name}
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-amber-50 p-3 rounded-xl border border-amber-200 leading-relaxed">
            🔒 <strong>Instant Lock:</strong> Claiming locks this batch exclusively for your organization while a delivery driver is dispatched.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleConfirmClaim}>
              Confirm & Lock Batch
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
