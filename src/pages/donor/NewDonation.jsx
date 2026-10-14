import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  CATEGORIES,
  KIT_PRICE_INR,
  KG_PER_KIT,
  HIGH_VOLUME_COOKED_KG,
  FHRI_AUDIT_THRESHOLD,
} from '../../utils/constants';
import { computeDecayIndex, urgencyBand } from '../../utils/decay';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FreshnessRing } from '../../components/FreshnessRing';
import { UrgencyBadge } from '../../components/UrgencyBadge';
import { Badge } from '../../components/ui/Badge';

export function NewDonation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    currentDonorId,
    ambientTemp,
    timeOffsetHours,
    createPost,
    getFhri,
  } = useApp();

  const initialCatParam = searchParams.get('category');
  const [category, setCategory] = useState(
    initialCatParam && CATEGORIES[initialCatParam] ? initialCatParam : 'cooked'
  );

  const defaultTitles = {
    cooked: "Veg Biryani & Dal Tadka",
    milk_sweets: "Rasgulla & Kalakand",
    bakery: "Fresh Assorted Buns & Puffs",
    dry_sweets: "Besan Laddoo & Mysore Pak",
  };

  const [title, setTitle] = useState(defaultTitles[category] || "Surplus Cooked Meals");
  const [weightKg, setWeightKg] = useState(15);
  const [prepHoursAgo, setPrepHoursAgo] = useState(1.0);
  const [kitRequested, setKitRequested] = useState(false);
  const [waiverAccepted, setWaiverAccepted] = useState(false);

  const currentCategory = CATEGORIES[category] || CATEGORIES.cooked;
  const meals = Math.round(weightKg * currentCategory.mealsPerKg);
  const neededKits = Math.ceil(weightKg / KG_PER_KIT);
  const kitCost = neededKits * KIT_PRICE_INR;

  // Calculate live decay index
  const elapsed = Number(prepHoursAgo) + timeOffsetHours;
  const decay = computeDecayIndex({
    elapsedHours: elapsed,
    tMax: currentCategory.tMax,
    alpha: currentCategory.alpha,
    ambientTemp,
  });
  const band = urgencyBand(decay);
  const isExpired = band === 'expired';

  // FHRI restriction check
  const fhri = getFhri(currentDonorId);
  const isFhriRestricted =
    fhri < FHRI_AUDIT_THRESHOLD &&
    category === 'cooked' &&
    weightKg > HIGH_VOLUME_COOKED_KG;

  const canSubmit = waiverAccepted && !isExpired && !isFhriRestricted;

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    setTitle(defaultTitles[newCat] || "Fresh Surplus Food");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const newId = createPost({
      category,
      title,
      weightKg,
      prepHoursAgo,
      kitRequested,
    });

    navigate(`/donor/passcard/${newId}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-ink">
          Post Surplus Food
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Input surplus food details to calculate live decay, generate a digital passcard, and algorithmically match with an NGO.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* Section 1: Category */}
          <Card>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              1. Choose Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Object.values(CATEGORIES).map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`cursor-pointer rounded-2xl p-3 border-2 transition-all flex flex-col items-center text-center ${
                      isSelected
                        ? "border-brand-600 bg-brand-50/60 shadow-xs ring-2 ring-brand-100"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <span className="text-3xl mb-1">{cat.emoji}</span>
                    <span className="font-heading font-bold text-xs text-ink leading-tight">
                      {cat.label}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1">
                      Safe: {cat.tMax} h
                    </span>
                    {isSelected && (
                      <span className="mt-1 text-[10px] font-bold text-brand-700">✓ Selected</span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Section 2: Food Name */}
          <Card>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              2. Food Name & Description
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Veg Biryani, Dal Makhani, Kalakand..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </Card>

          {/* Section 3: Quantity with Smart Converter */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                3. Quantity (kg)
              </label>
              <div className="text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                Smart Converter: <strong>{weightKg} kg ≈ {meals} meals</strong>
              </div>
            </div>

            <div className="py-2">
              <input
                type="range"
                min="1"
                max="50"
                step="0.5"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>1 kg</span>
                <span className="font-bold text-ink font-heading text-base">{weightKg} kg</span>
                <span>50 kg</span>
              </div>
            </div>
          </Card>

          {/* Section 4: Preparation Time */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                4. Prepared How Long Ago?
              </label>
              <span className="text-xs font-bold text-slate-700 font-mono">
                Prepared {prepHoursAgo} h ago
              </span>
            </div>

            <div className="py-2">
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={prepHoursAgo}
                onChange={(e) => setPrepHoursAgo(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>0 h (Just cooked)</span>
                <span>12 h</span>
              </div>
            </div>
          </Card>

          {/* Section 5: Storage Requirement */}
          <Card>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              5. Storage Integrity
            </label>
            <div className="flex items-center gap-2">
              <Badge variant={currentCategory.coldChain ? "amber" : "slate"} className="text-xs py-1 px-3">
                {currentCategory.storage}
              </Badge>
              {currentCategory.coldChain && (
                <span className="text-xs text-amber-700 font-medium">
                  ❄ Please keep refrigerated until driver pickup.
                </span>
              )}
            </div>
          </Card>

          {/* Section 6: Packaging Kit Add-on Toggle */}
          <Card>
            <label className="flex items-start justify-between cursor-pointer">
              <div className="pr-4">
                <span className="font-heading font-bold text-sm text-ink block">
                  6. Request MealBridge Packaging Kit
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tamper-evident, insulated food grade containers (1 kit per 2 kg).
                </p>
                {kitRequested && (
                  <p className="text-xs font-semibold text-brand-700 mt-1.5">
                    {neededKits} kits • ₹{kitCost} added to monthly corporate invoice
                  </p>
                )}
              </div>
              <input
                type="checkbox"
                checked={kitRequested}
                onChange={(e) => setKitRequested(e.target.checked)}
                className="w-5 h-5 mt-1 accent-brand-600 rounded cursor-pointer"
              />
            </label>
          </Card>

          {/* Section 7: Digital Liability Waiver */}
          <Card className="border-brand-200 bg-brand-50/30">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={waiverAccepted}
                onChange={(e) => setWaiverAccepted(e.target.checked)}
                className="w-5 h-5 mt-0.5 accent-brand-600 rounded cursor-pointer shrink-0"
              />
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-ink font-semibold">Digital Liability Waiver:</strong> I confirm this food is wholesome, freshly prepared under strict hygiene, and I authorize handover to verified recipient NGOs under the MealBridge Good Samaritan protocol.
              </div>
            </label>
          </Card>

          {/* FHRI Restriction Banner */}
          {isFhriRestricted && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 font-semibold animate-shake">
              ⚠️ Your FHRI is below 0.70 ({fhri.toFixed(2)}). High-volume cooked meal posts (&gt; 10 kg) are restricted until a physical audit is conducted. Please reduce quantity to 10 kg or below.
            </div>
          )}

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              size="lg"
              disabled={!canSubmit}
              className="w-full text-base font-bold shadow-md"
            >
              Post Surplus Food ({weightKg} kg • ≈ {meals} meals) →
            </Button>
            {!waiverAccepted && (
              <p className="text-center text-[11px] text-slate-400 mt-2">
                * Please check the digital liability waiver to enable posting.
              </p>
            )}
          </div>
        </form>

        {/* Right 1 Col: Live Preview Sticky Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card className="flex flex-col items-center text-center p-6 border-slate-200 shadow-md">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Live Freshness Preview
              </span>

              {/* Large Freshness Ring */}
              <div className="my-2">
                <FreshnessRing value={decay} size={130} strokeWidth={10} />
              </div>

              <div className="mt-3 mb-2">
                <UrgencyBadge band={band} className="text-sm px-3 py-1" />
              </div>

              <p className="text-xs text-slate-500 font-medium">
                Safe window: <strong className="text-ink">{currentCategory.tMax} h</strong> • Ambient: <strong className="text-ink">{ambientTemp}°C</strong>
              </p>

              <div className="w-full my-4 pt-4 border-t border-slate-100 flex items-center justify-around text-xs">
                <div>
                  <span className="text-slate-400 block">Quantity</span>
                  <span className="font-heading font-extrabold text-ink text-base">{weightKg} kg</span>
                </div>
                <div className="w-px h-8 bg-slate-100" />
                <div>
                  <span className="text-slate-400 block">Meals</span>
                  <span className="font-heading font-extrabold text-brand-700 text-base">≈ {meals}</span>
                </div>
              </div>

              {isExpired && (
                <div className="w-full p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-critical text-center">
                  ⛔ This food is already past its safe window and cannot be posted for safety reasons.
                </div>
              )}
            </Card>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-xs text-slate-500 space-y-2">
              <p className="font-semibold text-slate-700">💡 Algorithmic Freshness Note:</p>
              <p className="text-[11px] leading-relaxed">
                Decay Index (Dᵢ) accounts for thermal velocity at {ambientTemp}°C ambient temperature. Matches will be ranked automatically via binary Max-Heap.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
