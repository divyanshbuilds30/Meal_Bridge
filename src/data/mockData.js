// Elapsed hours at demo start = prepHoursAgo (demo offset is added on top at runtime)

export const donors = [
  { id: "d1", name: "Hotel Grand Orchid", type: "Hotel", emoji: "🏨", phone: "+91 90000 00001",
    fhriInputs: { onTime: 0.96, packaging: 0.90, spoils: 0.05 }, mapX: 22, mapY: 30 },
  { id: "d2", name: "Sri Ganesh Sweets", type: "Sweet Shop", emoji: "🍬", phone: "+91 90000 00002",
    fhriInputs: { onTime: 0.92, packaging: 0.85, spoils: 0.04 }, mapX: 45, mapY: 62 },
  { id: "d3", name: "Bake Haven", type: "Bakery", emoji: "🥐", phone: "+91 90000 00003",
    fhriInputs: { onTime: 0.88, packaging: 0.90, spoils: 0.10 }, mapX: 70, mapY: 28 },
  { id: "d4", name: "Royal Banquet Hall", type: "Caterer", emoji: "🍽️", phone: "+91 90000 00004",
    fhriInputs: { onTime: 0.97, packaging: 0.95, spoils: 0.02 }, mapX: 82, mapY: 70 },
];

export const ngos = [
  { id: "n1", name: "Asha Kiran Orphanage", type: "Orphanage", emoji: "🏠", headcount: 50,
    verification: "VERIFIED", phone: "+91 80000 00011", mapX: 35, mapY: 45 },
  { id: "n2", name: "Seva Community Kitchen", type: "Community Kitchen", emoji: "🍲", headcount: 120,
    verification: "VERIFIED", phone: "+91 80000 00012", mapX: 58, mapY: 40 },
  { id: "n3", name: "Hope Night Shelter", type: "Shelter", emoji: "🛏️", headcount: 35,
    verification: "VERIFIED", phone: "+91 80000 00013", mapX: 60, mapY: 78 },
  { id: "n4", name: "Bal Vikas Children's Home", type: "Children's Home", emoji: "🧒", headcount: 80,
    verification: "PENDING", phone: "+91 80000 00014", mapX: 88, mapY: 45 },
];

// distanceKm[donorId][ngoId]
export const distanceKm = {
  d1: { n1: 2.4, n2: 5.1, n3: 3.8, n4: 6.0 },
  d2: { n1: 1.2, n2: 4.0, n3: 2.9, n4: 7.2 },
  d3: { n1: 3.5, n2: 2.2, n3: 1.6, n4: 4.4 },
  d4: { n1: 6.3, n2: 3.3, n3: 5.0, n4: 2.1 },
};

export const driver = {
  id: "dr1", name: "Ravi Kumar", phone: "+91 70000 00021",
  earningsToday: 420, rating: 4.8, vehicle: "Bike • KA-00-MB-1234",
};

// status values must match STATUS in constants.js
export const initialPosts = [
  { id: "p1", donorId: "d1", category: "cooked", title: "Veg Biryani & Dal Tadka",
    weightKg: 15, meals: 45, prepHoursAgo: 2.0, status: "POSTED",
    pickupOtp: "3149", claimedBy: null, jobId: null, pickedUp: false },
  { id: "p2", donorId: "d2", category: "milk_sweets", title: "Rasgulla & Kalakand",
    weightKg: 6, meals: 24, prepHoursAgo: 4.0, status: "POSTED",
    pickupOtp: "6072", claimedBy: null, jobId: null, pickedUp: false },
  { id: "p3", donorId: "d3", category: "bakery", title: "Assorted Buns & Puffs",
    weightKg: 8, meals: 40, prepHoursAgo: 3.0, status: "POSTED",
    pickupOtp: "2285", claimedBy: null, jobId: null, pickedUp: false },
  { id: "p4", donorId: "d4", category: "cooked", title: "Wedding Dinner Surplus — Rice & Paneer Curry",
    weightKg: 25, meals: 75, prepHoursAgo: 3.5, status: "POSTED",
    pickupOtp: "9416", claimedBy: null, jobId: null, pickedUp: false },
  // batched job j1 (two pickups -> Hope Night Shelter), waiting for a driver
  { id: "p5", donorId: "d2", category: "dry_sweets", title: "Besan Laddoo & Mysore Pak",
    weightKg: 4, meals: 24, prepHoursAgo: 10.0, status: "CLAIMED",
    pickupOtp: "4821", claimedBy: "n3", jobId: "j1", pickedUp: false },
  { id: "p6", donorId: "d3", category: "bakery", title: "Evening Puffs & Rolls",
    weightKg: 5, meals: 25, prepHoursAgo: 2.0, status: "CLAIMED",
    pickupOtp: "5937", claimedBy: "n3", jobId: "j1", pickedUp: false },
  // job j2 already in transit (driver Ravi, heading to Seva Community Kitchen)
  { id: "p7", donorId: "d1", category: "cooked", title: "Lunch Buffet Leftovers",
    weightKg: 20, meals: 60, prepHoursAgo: 3.0, status: "IN_TRANSIT",
    pickupOtp: "1357", claimedBy: "n2", jobId: "j2", pickedUp: true },
  // delivered earlier (history for NGO n1 and donor d4)
  { id: "p8", donorId: "d4", category: "cooked", title: "Corporate Event Lunch",
    weightKg: 18, meals: 54, prepHoursAgo: 8.0, status: "DELIVERED_VERIFIED",
    pickupOtp: "7788", claimedBy: "n1", jobId: "j0", pickedUp: true },
  // auto-purged example (milk sweets left too long)
  { id: "p9", donorId: "d2", category: "milk_sweets", title: "Rabri (Old Batch)",
    weightKg: 3, meals: 12, prepHoursAgo: 7.0, status: "EXPIRED_AUTOMATED_PURGE",
    pickupOtp: "0000", claimedBy: null, jobId: null, pickedUp: false },
];

export const initialJobs = [
  { id: "j0", postIds: ["p8"], ngoId: "n1", driverId: "dr1", status: "DELIVERED_VERIFIED",
    dropoffOtp: "1111", routeKm: 6.3 },
  { id: "j1", postIds: ["p5", "p6"], ngoId: "n3", driverId: null, status: "CLAIMED",
    dropoffOtp: "7305", routeKm: 9.4 },
  { id: "j2", postIds: ["p7"], ngoId: "n2", driverId: "dr1", status: "IN_TRANSIT",
    dropoffOtp: "2468", routeKm: 5.1 },
];

// Enterprise / CSR (all hardcoded)
export const csr = {
  company: "TechNova Solutions Pvt Ltd",
  period: "Jul – Sep 2026",
  totals: { meals: 12840, kg: 4280, co2eKg: 10700, donations: 168 },
  monthly: [
    { month: "Apr", meals: 1650, co2e: 1375 },
    { month: "May", meals: 1980, co2e: 1650 },
    { month: "Jun", meals: 2210, co2e: 1842 },
    { month: "Jul", meals: 2390, co2e: 1992 },
    { month: "Aug", meals: 2290, co2e: 1908 },
    { month: "Sep", meals: 2320, co2e: 1933 },
  ],
  receipts: [
    { no: "80G-2026-0912", date: "30 Sep 2026", amountInr: 150000, meals: 2320 },
    { no: "80G-2026-0831", date: "31 Aug 2026", amountInr: 148000, meals: 2290 },
    { no: "80G-2026-0731", date: "31 Jul 2026", amountInr: 155000, meals: 2390 },
    { no: "80G-2026-0630", date: "30 Jun 2026", amountInr: 142000, meals: 2210 },
  ],
};

// Admin live activity feed — cycle through these every 6 seconds (client-side timer)
export const activityFeedSeed = [
  "🍛 Hotel Grand Orchid posted 15 kg Cooked Meals",
  "✅ Hope Night Shelter claimed Besan Laddoo batch",
  "🚚 Ravi Kumar picked up from Sri Ganesh Sweets",
  "⚠️ Bake Haven FHRI 0.69 — audit flagged",
  "🎯 Match found: Rasgulla → Asha Kiran Orphanage (P=0.86)",
  "🔐 Dropoff OTP verified at Seva Community Kitchen",
  "⛔ Rabri (Old Batch) auto-purged: Dᵢ ≥ 1.0",
];
