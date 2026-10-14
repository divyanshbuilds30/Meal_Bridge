export const T_BASE = 25; // °C baseline

export const CATEGORIES = {
  cooked: {
    id: "cooked", label: "Cooked Meals", emoji: "🍛",
    tMax: 6, alpha: 0.4, mealsPerKg: 3,
    storage: "Hot / Ambient", coldChain: false,
  },
  milk_sweets: {
    id: "milk_sweets", label: "Milk Sweets", emoji: "🍮",
    tMax: 6, alpha: 0.6, mealsPerKg: 4,
    storage: "Cold Chain (4°C – 10°C)", coldChain: true,
  },
  bakery: {
    id: "bakery", label: "Bakery & Fried Snacks", emoji: "🥐",
    tMax: 12, alpha: 0.15, mealsPerKg: 5,
    storage: "Ambient Room Temp", coldChain: false,
  },
  dry_sweets: {
    id: "dry_sweets", label: "Dry Sweets", emoji: "🍬",
    tMax: 48, alpha: 0.05, mealsPerKg: 6,
    storage: "Dry Ambient", coldChain: false,
  },
};

export const STATUS = {
  POSTED: "POSTED",
  ALGORITHMICALLY_MATCHED: "ALGORITHMICALLY_MATCHED",
  CLAIMED: "CLAIMED",
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED_VERIFIED: "DELIVERED_VERIFIED",
  EXPIRED_AUTOMATED_PURGE: "EXPIRED_AUTOMATED_PURGE",
};

export const STATUS_LABEL = {
  POSTED: "Posted",
  ALGORITHMICALLY_MATCHED: "Matched",
  CLAIMED: "Claimed",
  IN_TRANSIT: "In Transit",
  DELIVERED_VERIFIED: "Delivered ✓",
  EXPIRED_AUTOMATED_PURGE: "Expired (Auto-Purged)",
};

export const WEIGHTS = { w1: 0.4, w2: 0.35, w3: 0.25 }; // distance, decay, portion
export const FHRI_AUDIT_THRESHOLD = 0.7;
export const HIGH_VOLUME_COOKED_KG = 10; // "high-volume cooked meal" for FHRI restriction
export const KIT_PRICE_INR = 15;         // per kit
export const KG_PER_KIT = 2;             // 1 kit per 2 kg (round up)
export const PAYOUT_PER_KM_INR = 12;
export const CO2E_PER_KG_FOOD = 2.5;     // kg CO2e saved per kg food rescued
