// FHRI = 0.5*onTimePickup + 0.3*packagingCompliance - 0.2*spoilsOrRejections
// all three inputs are ratios in [0,1]
export function computeFHRI({ onTime, packaging, spoils }) {
  return 0.5 * onTime + 0.3 * packaging - 0.2 * spoils;
}
