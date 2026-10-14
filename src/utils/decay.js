import { T_BASE } from "./constants.js";

// Di = (t_elapsed / T_max) * [1 + alpha * max(0, (T_ambient - T_base) / T_base)]
export function computeDecayIndex({ elapsedHours, tMax, alpha, ambientTemp }) {
  const thermal = Math.max(0, (ambientTemp - T_BASE) / T_BASE);
  return (elapsedHours / tMax) * (1 + alpha * thermal);
}

export function urgencyBand(di) {
  if (di >= 1.0) return "expired";
  if (di > 0.7) return "critical";
  if (di >= 0.4) return "urgent";
  return "fresh";
}
