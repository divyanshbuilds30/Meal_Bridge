import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, STATUS, KIT_PRICE_INR } from '../../utils/constants';
import { Stat } from '../../components/ui/Stat';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { StatusChip } from '../../components/ui/StatusChip';
import { FreshnessRing } from '../../components/FreshnessRing';
import { FhriGauge } from '../../components/FhriGauge';
import { useToast } from '../../components/ui/Toast';

export function DonorDashboard() {
  const { currentDonorId, getDonor, getFhri, posts, getDecay } = useApp();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [kitModalOpen, setKitModalOpen] = useState(false);
  const [kitQuantity, setKitQuantity] = useState(10);
  const [paymentMethod, setPaymentMethod] = useState('invoice');

  const donor = getDonor(currentDonorId);
  const fhri = getFhri(currentDonorId);

  // Filter this donor's active posts
  const activeStatuses = [
    STATUS.POSTED,
    STATUS.ALGORITHMICALLY_MATCHED,
    STATUS.CLAIMED,
    STATUS.IN_TRANSIT,
  ];
  const donorPosts = posts.filter((p) => p.donorId === currentDonorId);
  const activePosts = donorPosts.filter((p) => activeStatuses.includes(p.status));

  const handleBuyKits = () => {
    setKitModalOpen(false);
    addToast('✅ Mock payment successful (no real transaction)', 'success');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{donor?.emoji || "🏨"}</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink font-heading">
                Welcome, {donor?.name}
              </h1>
              <p className="text-xs font-semibold text-brand-700 tracking-wide uppercase">
                {donor?.type} • Authorized Commercial Partner
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/donor/new">
            <Button size="md" className="shadow-sm">
              + Post Surplus Food
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Row (4 Stats including FHRI) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          label="Total Donated (Month)"
          value="312 kg"
          icon="📦"
          hint="Surplus diverted from landfill"
        />
        <Stat
          label="Meals Served"
          value="936"
          icon="🍽"
          hint="Fed to verified local shelters"
        />
        <Stat
          label="Active Posts"
          value={activePosts.length}
          icon="⚡"
          hint={`${activePosts.length} batch(es) in protocol`}
        />
        <Card className="flex flex-col justify-center">
          <FhriGauge value={fhri} />
        </Card>
      </div>

      {/* 1-Tap Category Presets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold font-heading text-ink">
              1-Tap Category Quick Post
            </h2>
            <p className="text-xs text-slate-500">
              Select a culinary food type to instantly prefill safe windows and conversion ratios
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(CATEGORIES).map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/donor/new?category=${cat.id}`)}
              className="cursor-pointer rounded-2xl bg-white border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-brand-400 transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {cat.emoji}
                </div>
                <h3 className="font-heading font-bold text-base text-ink group-hover:text-brand-600 transition-colors">
                  {cat.label}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {cat.storage}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-brand-700">Safe: {cat.tMax} h</span>
                <span className="text-slate-400 font-medium">≈ {cat.mealsPerKg} meals/kg</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Donations List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-heading text-ink">
            Active Donations
          </h2>
          <Link
            to="/donor/history"
            className="text-xs font-semibold text-brand-700 hover:text-brand-800"
          >
            View Full History →
          </Link>
        </div>

        {activePosts.length === 0 ? (
          <Card className="text-center py-12">
            <span className="text-4xl">🥗</span>
            <h4 className="text-base font-bold text-ink mt-3">No active donations right now</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Tap a preset above or click "Post Surplus Food" to connect your commercial surplus with verified shelters.
            </p>
            <Link to="/donor/new">
              <Button size="sm">Create New Food Post</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePosts.map((post) => {
              const cat = CATEGORIES[post.category] || CATEGORIES.cooked;
              const decay = getDecay(post);

              return (
                <Card key={post.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl border border-slate-100 shrink-0">
                        {cat.emoji}
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-base text-ink">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">{post.weightKg} kg</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-semibold text-brand-700">≈ {post.meals} meals</span>
                        </div>
                      </div>
                    </div>

                    <FreshnessRing value={decay} size={54} strokeWidth={5} showLabel={false} />
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <StatusChip status={post.status} />
                    <Link to={`/donor/passcard/${post.id}`}>
                      <Button variant="secondary" size="sm">
                        View Passcard →
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Packaging Kits & Billing Card */}
      <Card className="bg-gradient-to-r from-brand-50/50 to-white border-brand-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-base text-ink flex items-center gap-2">
              <span>📦</span> MealBridge Tamper-Evident Packaging Kits
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Kits used this month: <strong>24</strong> • <strong>₹360</strong> added to your monthly corporate invoice (₹15/kit).
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => setKitModalOpen(true)}
            className="shrink-0"
          >
            Buy Kits (Mock Checkout)
          </Button>
        </div>
      </Card>

      {/* Mock Checkout Modal */}
      <Modal
        open={kitModalOpen}
        onClose={() => setKitModalOpen(false)}
        title="Order MealBridge Packaging Kits"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Quantity (Pack of tamper-evident food containers)
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setKitQuantity((q) => Math.max(5, q - 5))}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-lg font-bold flex items-center justify-center text-slate-700"
              >
                −
              </button>
              <span className="font-heading font-extrabold text-2xl text-ink w-16 text-center">
                {kitQuantity}
              </span>
              <button
                type="button"
                onClick={() => setKitQuantity((q) => q + 5)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-lg font-bold flex items-center justify-center text-slate-700"
              >
                +
              </button>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between font-medium">
            <span>Price: ₹{KIT_PRICE_INR} / kit</span>
            <span className="text-base font-bold font-heading text-ink">
              Total: ₹{kitQuantity * KIT_PRICE_INR}
            </span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Payment Method (Visual Simulation)
            </label>
            <div className="space-y-2">
              {[
                { id: "invoice", label: "Add to Monthly Invoice (Corporate Net 30)" },
                { id: "upi", label: "UPI Instant Payment (GPay / PhonePe / Paytm)" },
                { id: "card", label: "Corporate Credit / Debit Card" },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === m.id
                      ? "border-brand-500 bg-brand-50/50 font-semibold text-brand-900"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id)}
                    className="accent-brand-600"
                  />
                  <span>{m.label}</span>
                </label>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-slate-400">
            Demo only — no live payment gateway or real transactions in Phase 1.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setKitModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleBuyKits}>
              Pay ₹{kitQuantity * KIT_PRICE_INR}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
