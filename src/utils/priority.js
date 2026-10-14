import { WEIGHTS } from "./constants.js";

// P = w1*(1/distanceKm) + w2*Di + w3*min(1, headcount/batchMeals)
// NOTE: distance is clamped to a minimum of 1 km so 1/d never exceeds 1.
export function computePriority({ distanceKm, decayIndex, headcount, meals }) {
  const dTerm = 1 / Math.max(distanceKm, 1);
  const urgencyTerm = Math.min(decayIndex, 1);
  const portionTerm = Math.min(1, headcount / Math.max(meals, 1));
  return WEIGHTS.w1 * dTerm + WEIGHTS.w2 * urgencyTerm + WEIGHTS.w3 * portionTerm;
}
