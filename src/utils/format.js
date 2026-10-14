// Formatting helpers

export function formatINR(amount) {
  if (amount === undefined || amount === null) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatHours(hours) {
  if (hours === 1) return "1 hour";
  return `${hours} hours`;
}

export function formatNumber(num) {
  if (num === undefined || num === null) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
}
