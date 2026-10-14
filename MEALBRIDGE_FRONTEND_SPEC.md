# MEALBRIDGE — FRONTEND PROTOTYPE BUILD SPEC (for Antigravity)

> **Read this entire file before writing any code.** This is the single source of truth. If something is not written here, do NOT invent it. If something is written here, build it exactly as described.

---

## 0. INSTRUCTIONS TO THE AI AGENT (HARD RULES)

1. **Frontend only. No backend. No database. No API calls.** There must be zero `fetch`, `axios`, `XMLHttpRequest`, WebSocket, Firebase, Supabase, Express or Node server code anywhere.
2. **All data is hardcoded** in `src/data/mockData.js` (provided in Section 7). State lives in React Context in memory. A page refresh resets everything. That is intended.
3. **Use ONLY the tech stack and exact versions in Section 2.** Do not swap in Next.js, TypeScript, Redux, Material UI, Bootstrap, Firebase, Mapbox, Google Maps JS SDK, or anything not listed.
4. **Do not add features** that are not in this document (no login/auth, no payments, no chat, no real GPS, no real camera, no real ML, no dark-mode toggle for the whole app).
5. **Use the formulas and mock data in Sections 6 and 7 verbatim.** Do not "improve" the math. Verify against the test vectors in Section 6.5.
6. **Build in the phase order of Section 12.** After each phase: run `npm run dev`, open the app in the browser, and tick that phase's checklist before moving on.
7. **Plain JavaScript (`.jsx` / `.js`), not TypeScript.**
8. **Every screen must work with the hardcoded data on first load** — no empty or broken screens, no console errors, no "TODO" placeholders, no lorem ipsum.
9. **No fake external images.** Use emoji, lucide-react icons, and CSS/SVG only. No remote image URLs, no map tile providers.
10. If something is ambiguous, choose the **simplest option that matches this document** and add a one-line code comment. Do not ask for clarification and do not over-engineer.
11. Keep each component file under ~250 lines. Split into smaller components if needed.
12. Currency is Indian Rupees (₹). Distances in km. Weights in kg. Temperatures in °C.

---

## 1. PROJECT OVERVIEW

**MealBridge** — *Connecting Surplus Food with Real Need through Smart Logistics.*

A web platform that connects commercial food donors (hotels, caterers, banquet halls, sweet shops, bakeries) with verified recipient organisations (shelters, orphanages, community kitchens) through delivery drivers/volunteers.

**What we are building now (Phase 1):** a clickable, polished **UI prototype** showing all four user experiences plus two dashboards, driven entirely by hardcoded data and client-side logic, so the team can demo the full lifecycle: **Post → Match → Claim → Pick up (OTP) → Deliver (OTP) → Verified.**

The ISE angle shown in the UI (computed client-side with real code, not faked numbers):
- **Decay Index (Dᵢ)** — live freshness meter
- **Priority Score (P)** via a Max-Heap — "best match" ranking
- **FHRI** — donor hygiene score and audit flag
- **Finite State Machine** — donation lifecycle with safety auto-purge
- **Dual OTP handshake** — pickup OTP and dropoff OTP

---

## 2. TECH STACK (EXACT)

| Purpose | Choice | Version / Note |
| --- | --- | --- |
| Build tool | **Vite** | `vite@5` |
| UI library | **React** | `react@18`, `react-dom@18` |
| Language | **JavaScript (JSX)** | no TypeScript |
| Routing | **react-router-dom** | `@6` (use `createBrowserRouter` OR `<BrowserRouter>`; use `<BrowserRouter>` for simplicity) |
| Styling | **Tailwind CSS** | `tailwindcss@3.4`, `postcss`, `autoprefixer` (**v3, NOT v4**) |
| Icons | **lucide-react** | latest |
| Charts | **recharts** | `@2` |
| QR code | **qrcode.react** | `@3` — use named export `QRCodeSVG` |
| State | **React Context + useReducer** | no external state library |
| Fonts | Google Fonts via `<link>` in `index.html` | Plus Jakarta Sans (headings), Inter (body) |
| Map | **Hand-built inline SVG** | no map library |

### Setup commands (run exactly)

```bash
npm create vite@5 mealbridge -- --template react
cd mealbridge
npm install react-router-dom@6 lucide-react recharts@2 qrcode.react@3
npm install -D tailwindcss@3.4 postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

### `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#F0FDF4", 100: "#DCFCE7", 200: "#BBF7D0", 500: "#22C55E",
          600: "#16A34A", 700: "#15803D", 900: "#14532D",
        },
        fresh: "#16A34A",
        urgent: "#F59E0B",
        critical: "#DC2626",
        ink: "#0F172A",
        night: { 900: "#0B1220", 800: "#111B2E", 700: "#1B2A44" },
        neon: { green: "#22C55E", cyan: "#22D3EE" },
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "100%": { transform: "scale(3)", opacity: "0" },
        },
        "scan-line": {
          "0%": { top: "8%" }, "50%": { top: "88%" }, "100%": { top: "8%" },
        },
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-6px)" },
          "75%": { transform: "translateX(6px)" },
        },
        "dash-move": { to: { strokeDashoffset: "-24" } },
      },
      animation: {
        "pulse-ring": "pulse-ring 2s ease-out infinite",
        "scan-line": "scan-line 2.4s ease-in-out infinite",
        shake: "shake 0.3s ease-in-out",
        "dash-move": "dash-move 1s linear infinite",
      },
    },
  },
  plugins: [],
};
```

### `src/index.css` (top of file)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body { @apply font-body bg-slate-50 text-ink antialiased; }
h1, h2, h3, h4 { @apply font-heading; }
```

### `index.html` `<head>` additions

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
<title>MealBridge</title>
```

---

## 3. SCOPE

### IN SCOPE (build all of these)
- Landing / role selector page
- Donor Portal (dashboard, new donation, passcard, history)
- Recipient Portal (listings feed, claim flow, my claims, tracking)
- Delivery Fleet App (job list, batched route, safety checklist, simulated scanner, OTP pad)
- Enterprise CSR dashboard
- Admin System Map dashboard (dark mode, SVG map)
- Floating **Demo Control Panel** (ambient temperature, time fast-forward, act-as-donor, reset)
- Client-side implementations of Dᵢ, Priority Score + Max-Heap, FHRI, and the lifecycle state machine

### OUT OF SCOPE (do NOT build)
- 🚫 Live payment gateway — kit purchase is a **mock checkout modal** only
- 🚫 In-app chat / WebSockets — use `tel:` links only
- 🚫 Turn-by-turn GPS / real map APIs — use the SVG map and Google Maps **deep links** only
- 🚫 Machine learning — Dᵢ is deterministic math
- 🚫 Login, signup, authentication, user accounts
- 🚫 Real camera access / real QR scanning — scanner is a **simulated viewfinder**
- 🚫 Backend, database, persistence, localStorage
- 🚫 Real OpenWeather call — ambient temperature is a **hardcoded value + slider**
- 🚫 PDF generation — "Download receipt" shows a toast only

---

## 4. FOLDER STRUCTURE (create exactly this)

```
src/
├── main.jsx
├── App.jsx                     # routes
├── index.css
├── context/
│   └── AppContext.jsx          # provider + reducer + actions (Section 8)
├── data/
│   └── mockData.js             # ALL hardcoded data (Section 7)
├── utils/
│   ├── constants.js            # categories, statuses, weights (Section 6)
│   ├── decay.js                # Decay Index
│   ├── priority.js             # Priority score
│   ├── maxHeap.js              # Max-Heap class
│   ├── fhri.js                 # FHRI
│   └── format.js               # helpers (formatHours, formatINR, etc.)
├── components/
│   ├── layout/
│   │   ├── AppShell.jsx        # top bar + role switcher + <Outlet/>
│   │   ├── DemoPanel.jsx       # floating demo controls
│   │   └── MobileFrame.jsx     # centered max-w-md frame for driver app
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── Modal.jsx
│   │   ├── Toast.jsx           # ToastProvider + useToast
│   │   ├── Stat.jsx            # KPI stat card
│   │   └── StatusChip.jsx      # lifecycle status chip
│   ├── FreshnessRing.jsx       # circular Dᵢ meter (SVG)
│   ├── UrgencyBadge.jsx        # Fresh / Urgent / Critical
│   ├── StatusStepper.jsx       # 4-stage tracker
│   ├── OtpPad.jsx              # numeric keypad
│   ├── QrScannerSim.jsx        # fake viewfinder
│   ├── FhriGauge.jsx
│   ├── ListingCard.jsx         # recipient listing
│   └── RouteTimeline.jsx       # batched route visual
└── pages/
    ├── Landing.jsx
    ├── donor/        DonorDashboard.jsx, NewDonation.jsx, Passcard.jsx, DonorHistory.jsx
    ├── recipient/    RecipientFeed.jsx, RecipientTracking.jsx
    ├── driver/       DriverHome.jsx, DriverJob.jsx
    ├── enterprise/   EnterpriseDashboard.jsx
    └── admin/        AdminMap.jsx
```

---

## 5. DESIGN SYSTEM

### 5.1 Look & feel
Clean, friendly, trustworthy "social-good meets fintech" style. Lots of white space, rounded corners, soft shadows. Green is the brand colour.

### 5.2 Colours (use the Tailwind tokens from the config)
| Use | Token |
| --- | --- |
| Primary buttons, links, brand | `brand-600` (hover `brand-700`) |
| Light brand backgrounds | `brand-50` / `brand-100` |
| Page background | `bg-slate-50` |
| Cards | `bg-white`, `border border-slate-200`, `rounded-2xl`, `shadow-sm` |
| Fresh 🟢 | `fresh` (`#16A34A`) |
| Urgent 🟠 | `urgent` (`#F59E0B`) |
| Critical 🔴 | `critical` (`#DC2626`) |
| Admin dashboard | `night-900` bg, `night-800` panels, `neon-green`, `neon-cyan` accents |

### 5.3 Typography
- Headings: `font-heading font-bold`
- Body: `font-body`
- Page title `text-2xl md:text-3xl`; section title `text-lg font-semibold`; small meta `text-sm text-slate-500`.

### 5.4 Component rules
- **Button** variants: `primary` (brand-600 bg, white text), `secondary` (white bg, slate border), `danger` (critical), `ghost`. Sizes `sm | md | lg`. All `rounded-xl`, with a visible `disabled` style.
- **Card**: `rounded-2xl bg-white border border-slate-200 p-4 md:p-6`.
- **Badge**: small pill `rounded-full px-2.5 py-0.5 text-xs font-medium`.
- **Modal**: centred overlay, `bg-black/50` backdrop, white `rounded-2xl` panel, close (X) button, closes on backdrop click.
- **Toast**: bottom-center on mobile, top-right on desktop, auto-dismiss in 3 s. Implement with a small custom `ToastProvider` (no library).
- **Responsive**: donor, recipient, enterprise = fully responsive (mobile → desktop). Driver app = **mobile-first**, rendered in a centred `max-w-md` frame even on desktop. Admin = desktop-first.
- **Accessibility basics**: buttons are real `<button>`, inputs have labels, colour is never the only indicator (always pair colour with text such as "Fresh").

### 5.5 Urgency bands (single source of truth)
| Band | Dᵢ range | Label | Colour |
| --- | --- | --- | --- |
| fresh | `Dᵢ < 0.4` | 🟢 Fresh | green |
| urgent | `0.4 ≤ Dᵢ ≤ 0.7` | 🟠 Urgent | amber |
| critical | `0.7 < Dᵢ < 1.0` | 🔴 Critical | red |
| expired | `Dᵢ ≥ 1.0` | ⚫ Expired | slate (delisted) |

---

## 6. LOGIC MODULES (copy these exactly)

### 6.1 `src/utils/constants.js`

```js
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
```

### 6.2 `src/utils/decay.js`

```js
import { T_BASE } from "./constants";

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
```

### 6.3 `src/utils/priority.js` and `maxHeap.js`

```js
// priority.js
import { WEIGHTS } from "./constants";

// P = w1*(1/distanceKm) + w2*Di + w3*min(1, headcount/batchMeals)
// NOTE: distance is clamped to a minimum of 1 km so 1/d never exceeds 1.
export function computePriority({ distanceKm, decayIndex, headcount, meals }) {
  const dTerm = 1 / Math.max(distanceKm, 1);
  const urgencyTerm = Math.min(decayIndex, 1);
  const portionTerm = Math.min(1, headcount / Math.max(meals, 1));
  return WEIGHTS.w1 * dTerm + WEIGHTS.w2 * urgencyTerm + WEIGHTS.w3 * portionTerm;
}
```

```js
// maxHeap.js — array-based binary max-heap keyed on `priority`
export class MaxHeap {
  constructor() { this.a = []; }
  size() { return this.a.length; }
  push(item) {            // item = { priority, ...anything }
    this.a.push(item);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[p].priority >= this.a[i].priority) break;
      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];
      i = p;
    }
  }
  pop() {
    if (!this.a.length) return null;
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;
      for (;;) {
        let l = 2 * i + 1, r = l + 1, m = i;
        if (l < this.a.length && this.a[l].priority > this.a[m].priority) m = l;
        if (r < this.a.length && this.a[r].priority > this.a[m].priority) m = r;
        if (m === i) break;
        [this.a[m], this.a[i]] = [this.a[i], this.a[m]];
        i = m;
      }
    }
    return top;
  }
  // convenience: returns all items best-first
  toSortedArray() {
    const copy = new MaxHeap(); copy.a = [...this.a];
    const out = []; let x;
    while ((x = copy.pop())) out.push(x);
    return out;
  }
}
```

**Usage rule:** The Recipient feed builds a `MaxHeap` of listings for the current NGO and renders `heap.toSortedArray()` as "Best match first". Show a small ⓘ tooltip: *"Ranked by Max-Heap priority score P = 0.40·proximity + 0.35·urgency + 0.25·portion match."*

### 6.4 `src/utils/fhri.js`

```js
// FHRI = 0.5*onTimePickup + 0.3*packagingCompliance - 0.2*spoilsOrRejections
// all three inputs are ratios in [0,1]
export function computeFHRI({ onTime, packaging, spoils }) {
  return 0.5 * onTime + 0.3 * packaging - 0.2 * spoils;
}
// Donors with FHRI < 0.7 => flagged for physical audit AND restricted
// from posting high-volume cooked meals (> HIGH_VOLUME_COOKED_KG kg).
```

### 6.5 TEST VECTORS (the agent MUST verify these in the running app)

Default demo ambient temperature = **32 °C** (so thermal term = (32−25)/25 = 0.28).

| Post | Category | Elapsed (h) | Expected Dᵢ | Band |
| --- | --- | --- | --- | --- |
| p1 | cooked | 2.0 | **0.371** | fresh |
| p2 | milk_sweets | 4.0 | **0.779** | critical |
| p3 | bakery | 3.0 | **0.261** | fresh |
| p4 | cooked | 3.5 | **0.649** | urgent |
| p5 | dry_sweets | 10.0 | **0.211** | fresh |
| p6 | bakery | 2.0 | **0.174** | fresh |
| p7 | cooked | 3.0 | **0.556** | urgent |
| p9 | milk_sweets | 7.0 | **1.363** | expired |

Priority scores for **NGO n1 (Asha Kiran Orphanage, headcount 50)** at 32 °C, open posts only:

| Post | Distance to n1 | Meals | P (expected) | Rank |
| --- | --- | --- | --- | --- |
| p2 | 1.2 km | 24 | **0.856** | 1 |
| p1 | 2.4 km | 45 | **0.546** | 2 |
| p4 | 6.3 km | 75 | **0.457** | 3 |
| p3 | 3.5 km | 40 | **0.455** | 4 |

FHRI (donor seed inputs in Section 7):

| Donor | FHRI (2 dp) | Status |
| --- | --- | --- |
| d1 Hotel Grand Orchid | **0.74** | OK |
| d2 Sri Ganesh Sweets | **0.71** | OK |
| d3 Bake Haven | **0.69** | ⚠ Flagged for audit |
| d4 Royal Banquet Hall | **0.77** | OK |

---

## 7. MOCK DATA — `src/data/mockData.js` (copy exactly)

```js
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
```

---

## 8. STATE — `src/context/AppContext.jsx`

Use `createContext` + `useReducer`. Wrap `<App/>` in `<AppProvider>` and `<ToastProvider>`. **No persistence.**

### 8.1 State shape

```js
{
  role: null | "donor" | "recipient" | "driver" | "enterprise" | "admin",
  currentDonorId: "d1",          // changed via Demo Panel "Act as donor"
  currentNgoId: "n1",            // fixed to n1 in Phase 1
  ambientTemp: 32,               // °C, Demo Panel slider 20–42
  timeOffsetHours: 0,            // Demo Panel fast-forward; added to every post's elapsed time
  posts: [...initialPosts],
  jobs: [...initialJobs],
  ngoHeadcount: { n1: 50, n2: 120, n3: 35, n4: 80 },   // n1 editable on Recipient feed
  activity: [...]                // admin feed
}
```

### 8.2 Derived helpers (exported from context)

| Helper | Returns |
| --- | --- |
| `getElapsed(post)` | `post.prepHoursAgo + timeOffsetHours` |
| `getDecay(post)` | `computeDecayIndex({ elapsedHours: getElapsed(post), tMax, alpha, ambientTemp })` using the post's category |
| `getBand(post)` | `urgencyBand(getDecay(post))` |
| `getDonor(id)`, `getNgo(id)` | lookup from mockData |
| `getFhri(donorId)` | `computeFHRI(donor.fhriInputs)` |
| `getPriorityFor(post, ngoId)` | `computePriority({ distanceKm: distanceKm[post.donorId][ngoId], decayIndex: getDecay(post), headcount: ngoHeadcount[ngoId], meals: post.meals })` |
| `bestNgoFor(post)` | verified NGO (`verification === "VERIFIED"`) with highest `getPriorityFor` |

### 8.3 Actions (exposed as functions)

| Action | Behaviour |
| --- | --- |
| `createPost({ category, title, weightKg, prepHoursAgo, kitRequested })` | Creates post for `currentDonorId`. `meals = Math.round(weightKg * mealsPerKg)`. Random 4-digit `pickupOtp`. Status `POSTED`. Returns new id. **After 3 seconds (setTimeout), if still `POSTED`, set status to `ALGORITHMICALLY_MATCHED` and show a toast: "Matched with {bestNgo.name} (P = x.xx)".** |
| `claimPost(postId, ngoId)` | Allowed only if status is `POSTED` or `ALGORITHMICALLY_MATCHED` and band ≠ expired. Creates job `{ id: "j"+n, postIds:[postId], ngoId, driverId:null, status:"CLAIMED", dropoffOtp: random 4-digit, routeKm: distanceKm[donorId][ngoId] + 2 }`. Sets post `status:"CLAIMED"`, `claimedBy`, `jobId`. |
| `acceptJob(jobId)` | Sets `job.driverId = "dr1"`. (Called after the safety checklist modal is confirmed.) |
| `verifyPickup(jobId, postId, code)` | If `code === post.pickupOtp` → `post.pickedUp = true`, return `true`. Else return `false`. When **every non-expired post** of the job is `pickedUp`, set job + those posts to `IN_TRANSIT`. |
| `verifyDropoff(jobId, code)` | If `code === job.dropoffOtp` and job is `IN_TRANSIT` → job + posts → `DELIVERED_VERIFIED`, return `true`. Else `false`. |
| `setAmbientTemp(n)` | Updates temp. |
| `advanceTime(hours)` | `timeOffsetHours += hours`. |
| `setHeadcount(ngoId, n)` | Clamp 1–500. |
| `setCurrentDonor(id)` | Switches acting donor. |
| `resetDemo()` | Restores everything to initial state, `ambientTemp = 32`, `timeOffsetHours = 0`. |

### 8.4 Safety Intercept (finite-state-machine rule)

A `useEffect` runs whenever `ambientTemp`, `timeOffsetHours`, or `posts` change. For every post whose status is in `[POSTED, ALGORITHMICALLY_MATCHED, CLAIMED]` **and** `getDecay(post) >= 1.0`: set status to `EXPIRED_AUTOMATED_PURGE` and show a toast **"⛔ {title} auto-purged (Dᵢ ≥ 1.0)"**. Posts already `IN_TRANSIT` are **not** purged. If a purged post belonged to a job, that stop shows "Expired – skip" in the driver app and the job continues with the remaining stops.

### 8.5 Allowed lifecycle transitions (only these)

```
POSTED → ALGORITHMICALLY_MATCHED → CLAIMED → IN_TRANSIT → DELIVERED_VERIFIED
POSTED | ALGORITHMICALLY_MATCHED | CLAIMED → EXPIRED_AUTOMATED_PURGE   (when Di >= 1.0)
```

---

## 9. ROUTES (`App.jsx`)

| Path | Component | Layout |
| --- | --- | --- |
| `/` | `Landing` | none |
| `/donor` | `DonorDashboard` | AppShell |
| `/donor/new` | `NewDonation` (reads `?category=` query param to preselect) | AppShell |
| `/donor/passcard/:postId` | `Passcard` | AppShell |
| `/donor/history` | `DonorHistory` | AppShell |
| `/recipient` | `RecipientFeed` | AppShell |
| `/recipient/tracking/:jobId` | `RecipientTracking` | AppShell |
| `/driver` | `DriverHome` | MobileFrame |
| `/driver/job/:jobId` | `DriverJob` | MobileFrame |
| `/enterprise` | `EnterpriseDashboard` | AppShell |
| `/admin` | `AdminMap` | own dark layout |

`DemoPanel` renders on **every route except `/`**. Unknown path → redirect to `/`.

**AppShell top bar:** MealBridge logo (🌉 + wordmark, links to `/`), role-specific nav links, and a "Switch role" dropdown listing all five roles (navigates to that role's home). Show the current acting donor/NGO name on the right.

Role-specific nav:
- Donor: Dashboard · New Donation · History
- Recipient: Listings · My Claims (anchor to tab on same page)
- Enterprise: Impact Dashboard
- (Driver and Admin have their own headers.)

---

## 10. SCREEN SPECIFICATIONS

### 10.0 Demo Control Panel (`DemoPanel.jsx`)

Floating button bottom-left (🎛 "Demo") that expands a small card (collapsed by default). Contents:
1. **Ambient temperature** slider 20–42 °C (step 1). Label: "🌤 Ambient {n}°C — simulated (OpenWeather in Phase 2)".
2. **Time travel:** buttons `+1 h`, `+3 h`, and a readout "Time offset: +{n} h".
3. **Act as donor:** `<select>` of the four donors (affects Donor portal only).
4. **Hint codes** (small grey text): "Seeded OTPs → Pickup p5: 4821 · p6: 5937 · Dropoff j1: 7305 · Dropoff j2: 2468".
5. **Reset demo** button (danger/ghost) → `resetDemo()` + toast "Demo reset".

### 10.1 Landing (`/`)

- Full-width hero: gradient `from-brand-50 to-white`. Logo, H1 **"Turn today's surplus into tonight's meal."**, tagline *"Connecting Surplus Food with Real Need through Smart Logistics."*
- Three small stat pills: "🍽 12,840 meals delivered" · "🌍 10.7 t CO₂e saved" · "🤝 4 verified partners" (hardcoded).
- **Role cards grid (5 cards)**, each with emoji/icon, title, one-line description, and "Enter →" button which sets `role` and navigates:
  1. 🏨 **Donor** — "Hotels, caterers, sweet shops & bakeries" → `/donor`
  2. 🏠 **Recipient** — "NGOs, shelters & orphanages" → `/recipient`
  3. 🚚 **Delivery Partner** — "Drivers & volunteers" → `/driver`
  4. 🏢 **Enterprise (CSR)** — "Corporate impact & 80G receipts" → `/enterprise`
  5. 🛰 **Admin Console** — "Live system map" → `/admin`
- Below: a 4-step "How it works" row: Post → Match → Pick up (OTP) → Deliver (OTP).
- Footer: "MealBridge · ISE IDT Project · Phase 1 Prototype (hardcoded demo data)".

### 10.2 Donor Dashboard (`/donor`)

Header: "Welcome, {donor.name}" + subtitle `{donor.type}`.

1. **KPI row (4 `Stat` cards):** "Total donated this month — 312 kg" · "Meals served — 936" · "Active posts — {count of this donor's posts with status POSTED/MATCHED/CLAIMED/IN_TRANSIT}" · **FHRI gauge card**.
2. **FHRI card (`FhriGauge`):** semicircle or horizontal gauge showing `getFhri(currentDonorId)` to 2 dp. ≥ 0.70 → green badge "Good standing". < 0.70 → red badge "⚠ Audit flagged" with note "High-volume cooked meal posting is restricted until audit." Show formula in tiny text: "0.5·OnTime + 0.3·Packaging − 0.2·Spoils".
3. **"Quick post" — 1-Tap Category Presets:** 4 large cards (emoji, label, storage line, shelf-life line e.g. "Safe window: 6 h"). Click → `/donor/new?category=<id>`.
4. **Active donations list:** for each of this donor's posts whose status ≠ DELIVERED_VERIFIED/EXPIRED: a card with title, category badge, weight, meals, small `FreshnessRing`, `StatusChip`, and button "View Passcard" (→ `/donor/passcard/:id`). Empty state: "No active donations. Tap a preset above to post surplus food."
5. **Packaging Kits & Billing card:** text "Kits used this month: 24 · ₹360 on your monthly invoice". Button **"Buy kits (mock checkout)"** opens a Modal: quantity stepper (default 10), total = qty × ₹15, a fake payment-method radio (UPI / Card / Add to monthly invoice — all just visual), and a **"Pay ₹{total}"** button → closes modal + toast "✅ Mock payment successful (no real transaction)". Add a small grey note: "Demo only — no live payment gateway in Phase 1."

### 10.3 New Donation (`/donor/new`)

Single-page form with numbered sections on the left (or stacked on mobile) and a sticky **Live Preview card** on the right (stacked below on mobile).

1. **Choose category** — 4 preset cards (selected = brand border + tick). Preselect from `?category=`; default `cooked`.
2. **Food name** — text input, placeholder per category (e.g. "e.g. Veg Biryani & Dal"). Default prefilled with a sensible example.
3. **Quantity** — slider 1–50 kg, step 0.5, default 15 kg. **Smart Quantity Converter** label beside it: "**{weight} kg ≈ {meals} meals**" where `meals = Math.round(weight * mealsPerKg)`.
4. **Prepared how long ago?** — slider 0–12 h, step 0.5, default 1 h. Label: "Prepared {x} h ago".
5. **Storage** — read-only chip from category (`Cold Chain (4°C – 10°C)` etc.). If `coldChain`, show amber note: "❄ Keep refrigerated until pickup."
6. **Packaging kit add-on toggle** — switch "Request MealBridge packaging kit". When on: "{ceil(weight/2)} kits · ₹{kits×15} added to monthly invoice".
7. **Digital liability waiver** — required checkbox: "I confirm this food is safe, freshly prepared, and hand it over under the MealBridge liability waiver."
8. **Submit button** "Post Surplus Food" (disabled until waiver ticked).

**Live Preview card:** `FreshnessRing` (large) showing current Dᵢ using `elapsed = prepHoursAgo + timeOffsetHours`, the category's `tMax`/`alpha`, and `ambientTemp`; text "Safe window: {tMax} h · Ambient {temp}°C"; badge with urgency band; line "≈ {meals} meals · {weight} kg". If band is `expired` → red alert "This food is already past its safe window and cannot be posted" and **disable submit**.

**FHRI restriction:** if `getFhri(currentDonorId) < 0.7` AND category is `cooked` AND `weight > 10` → show red banner "Your FHRI is below 0.70. High-volume cooked meal posts (> 10 kg) are restricted until a physical audit." and **disable submit**.

**On submit:** `createPost(...)` → toast "Posted! Finding the best match…" → navigate to `/donor/passcard/:newId`.

### 10.4 Passcard (`/donor/passcard/:postId`)

Centered ticket-style card (max-w-md):
- Header: category emoji + title + `StatusChip`.
- **QR code** (`QRCodeSVG`, size 180) with value `MEALBRIDGE|POST:{id}|PICKUP`.
- Large **4-digit Pickup OTP** displayed as four separate digit boxes. Caption: "Show this to the driver at pickup".
- Details grid: Weight, Meals, Storage, Freshness (`FreshnessRing` small + band label), Packaging kit (Yes/No).
- Status-dependent info box:
  - `POSTED`: "🔎 Finding the best recipient…"
  - `ALGORITHMICALLY_MATCHED`: "🎯 Matched with {ngo.name} · Driver dispatch pending"
  - `CLAIMED`: "✅ Claimed by {ngo.name}. Driver assigned: Ravi Kumar · ETA ~18 min" + `tel:` button
  - `IN_TRANSIT`: "🚚 Picked up — on the way"
  - `DELIVERED_VERIFIED`: "🎉 Delivered & verified"
  - `EXPIRED_AUTOMATED_PURGE`: red "⛔ Auto-purged: freshness limit exceeded. Please do not hand over this food."
- Footer small print: "Handover is covered by the MealBridge digital liability waiver you accepted."
- Back link to dashboard.

If `postId` not found → friendly "Donation not found" with link back.

### 10.5 Donor History (`/donor/history`)

Table (cards on mobile) of all posts by `currentDonorId`: Title · Category · Weight · Meals · Status chip · Passcard link. Sorted newest first (reverse array order). Empty state included.

### 10.6 Recipient Feed (`/recipient`)

Header: NGO name + type. Two tabs: **Available Listings** | **My Claims**.

**Controls bar (Available tab):**
- **Capacity Headcount Filter:** "Feeding **[− 50 +]** people" stepper (step 5) bound to `ngoHeadcount.n1`; changing it recomputes everything live.
- Toggle "Only compatible listings" (default ON). **Compatible = `post.meals >= 0.5 * headcount`**.
- Category chips (All + 4 categories).
- Sort label (non-interactive): "Sorted by best match ⓘ" with the tooltip text from Section 6.3.

**List:** include only posts with status `POSTED` or `ALGORITHMICALLY_MATCHED` and band ≠ expired. Build a `MaxHeap` using `getPriorityFor(post, "n1")` → render `toSortedArray()` after filters. Show a line at the top: "{n} listings auto-delisted for safety" counting posts with status `EXPIRED_AUTOMATED_PURGE` (only if n > 0).

**`ListingCard`** (colour-coded urgency card — left border 4px in band colour):
- Row 1: category emoji + title; right side `UrgencyBadge` (🟢 Fresh / 🟠 Urgent / 🔴 Critical).
- Freshness bar: thin progress bar width `min(Di,1)*100%` in band colour + text "Freshness used: {Di*100 rounded}%".
- Meta chips: `{weight} kg`, `≈ {meals} meals`, `{distance} km away`, storage chip (❄ for cold chain).
- Donor line: emoji + donor name + `FHRI {x.xx}` small badge.
- "Covers {min(100, round(headcount/meals*100))}% of your headcount" line — when `meals < headcount`, otherwise "✓ Fully covers your headcount".
- Small grey "Priority score P = {0.xxx}".
- Top-ranked card gets a "⭐ Best match" ribbon.
- **Button "Claim & Lock"** → opens confirm Modal: summary + note "Claiming locks this batch while a driver is dispatched" → **Confirm** → `claimPost` → toast "🔒 Batch locked! Driver will be dispatched." → card disappears from Available and appears in My Claims.

**My Claims tab:** list of jobs where `ngoId === "n1"`: title(s), `StatusChip`, compact `StatusStepper`, button "Track" → `/recipient/tracking/:jobId`. Includes seeded delivered job j0.

### 10.7 Recipient Tracking (`/recipient/tracking/:jobId`)

- Large **`StatusStepper` (4 stages):** `Matched/Claimed → Driver Assigned → In Transit → Delivered`. Map job state: `CLAIMED` & no driver → stage 1; `CLAIMED` & driver → stage 2; `IN_TRANSIT` → stage 3; `DELIVERED_VERIFIED` → stage 4 (all green). Completed stages green with ✓; current stage pulses.
- **Dropoff OTP card:** "Give this code to the driver when food arrives" + 4 large digits (`job.dropoffOtp`).
- Driver card: Ravi Kumar, rating, vehicle, `tel:` button (only if a driver is assigned; else "Driver will be assigned shortly").
- Items list with titles, meals, urgency badges.
- Note under the stepper: "Status updates automatically as the driver verifies OTPs." (It updates because the shared context changes when the user switches to the driver role in the same tab session.)

### 10.8 Driver Home (`/driver`) — mobile-first

Rendered inside `MobileFrame` (max-w-md, centred, white, rounded, shadow on desktop).

- **Header:** "Hi, Ravi 👋", rating, "Today's earnings ₹420" pill.
- Two tabs: **Available** | **Active**.
- **Available tab:** jobs where `driverId === null` and status `CLAIMED`. **Active tab:** jobs where `driverId === "dr1"` and status in `CLAIMED`/`IN_TRANSIT`.
- **Job card:**
  - **`RouteTimeline`** (vertical line with dots): `📍 Pick up: {donor A}` → `📍 Pick up: {donor B}` (if batched) → `🏁 Deliver: {NGO}`. Example for j1: *Pick up Sri Ganesh Sweets + Bake Haven → Deliver Hope Night Shelter.*
  - Chips: total km (`routeKm`), total meals, max-urgency badge among the job's posts, payout **₹{round(routeKm × 12)}** ("₹12/km").
  - Available: button **"Accept job"** → opens **Safety Inspection Checklist modal** (below). Active: button "Continue" → `/driver/job/:id`.
- Empty states: "No jobs right now. New claims will appear here." / "No active jobs."

**Safety Inspection Checklist modal (3-point, all must be ticked to enable "Start job"):**
1. ☐ Food is in a sealed, tamper-evident MealBridge box.
2. ☐ Food looks fresh — no bad smell or discolouration.
3. ☐ If cold-chain item: temperature tag shows 4–10 °C. Otherwise: freshness meter shows below 100%. (Show the cold-chain wording only if any post in the job has `coldChain`, else the freshness wording.)
"Start job" → `acceptJob(id)` → navigate `/driver/job/:id`.

### 10.9 Driver Job (`/driver/job/:jobId`)

Mobile layout. Top: back arrow, job id, payout chip.

**Phase A — Pickups (one expandable stop card per post, in order):**
Each stop card shows: donor name, address-less line (donor type), items + meals, `FreshnessRing` small, buttons **[🧭 Navigate]** (opens `https://www.google.com/maps/search/?api=1&query={encodeURIComponent(donor.name)}` in a new tab) and **[📞 Call]** (`tel:`). If the stop is the *current* one:
- **`QrScannerSim`:** dark rounded box with corner brackets, an animated scan line (`animate-scan-line`), caption "Point camera at donor's QR". Button **"Simulate scan"** → after 1 s shows ✅ "QR matched: {title}" and reveals the OTP pad. *(No real camera access.)*
- **`OtpPad`:** 4 digit display boxes, 3×4 keypad (1–9, ⌫, 0, ✓). Submitting calls `verifyPickup`. Wrong code → boxes turn red, `animate-shake`, message "Incorrect OTP. Ask donor to show their Passcard." Correct → stop turns green ✓ "Picked up", next stop becomes current. If the stop's post is expired: show "⛔ Expired – skip" and auto-advance.

**Phase B — Delivery** (after all non-expired stops are picked up and job is `IN_TRANSIT`): header "🚚 In transit to {NGO}", buttons Navigate/Call (NGO), then `OtpPad` labelled "Enter Dropoff OTP from {NGO} manager". Correct → `verifyDropoff` → success screen.

**Success screen:** big animated ✓ (CSS scale-in), "Delivered & Verified!", "{meals} meals delivered", "You earned ₹{payout}", button "Back to jobs".

If the job is already `IN_TRANSIT` on load (seed j2) → open directly in Phase B. If `DELIVERED_VERIFIED` → show success summary.

### 10.10 Enterprise Dashboard (`/enterprise`)

Header: company name + "Reporting period: {csr.period}". Light theme, `AppShell`.

1. **KPI row:** "Meals delivered 12,840" · "Food rescued 4,280 kg" · "CO₂e offset 10,700 kg" · "Donations 168".
2. **Charts (recharts, in `ResponsiveContainer`):** Bar chart "Meals delivered per month" (`csr.monthly`, key `meals`, fill brand-600) and Line chart "CO₂e saved (kg) per month" (key `co2e`, stroke `#0EA5E9`). Both with tooltip, axes, grid.
3. **Quarterly report card:** "Q2 FY 2026-27 CSR Impact Report" with **Download report** button → toast "📄 Report download is a mock in Phase 1".
4. **Section 80G receipts table:** columns Receipt No · Date · Amount (₹, Indian number format) · Meals funded · **Download** button (toast "Mock receipt downloaded"). Tiny note: "Eligible for tax exemption under Section 80G".
5. Small formula note: "CO₂e saved = food rescued (kg) × 2.5".

### 10.11 Admin Map (`/admin`) — dark mode

Own layout, background `night-900`, text slate-200. Header: logo, "System Control Room", live clock (client `Date`, updates each second), link "← Exit".

**Left (≈ 2/3 width): SVG system map** (`viewBox="0 0 100 100"` scaled with CSS, `preserveAspectRatio="none"` NOT used — keep aspect ratio via fixed container height ~ 480px):
- Faint grid lines / dotted background drawn with SVG `<pattern>`.
- **Donor nodes** (neon-green circles, r=1.6) at `mapX/mapY` with **pulse rings** — a second circle with CSS `animate-pulse-ring` (`transform-origin: center; transform-box: fill-box`). Nodes whose donor has any active post pulse; others static.
- **NGO nodes** (neon-cyan squares/diamonds). `PENDING` NGO drawn hollow/grey.
- **Transit vector lines:** for every job with status `IN_TRANSIT`, draw a dashed line from the donor node of its first post to the NGO node, stroke neon-cyan, `stroke-dasharray="3 3"` with `animate-dash-move`, plus a small moving dot (SMIL `<animateMotion>` or CSS) along the line.
- Labels: tiny white text under each node (donor/NGO name).
- Legend (bottom-left of map): ● Donor · ◆ NGO · ┅ In transit.

**Right column (≈ 1/3):**
- **Live surplus metrics (derived from context):** "Surplus available now — {kg of POSTED/MATCHED/CLAIMED posts} kg", "In transit — {n} jobs / {kg} kg", "Delivered (session + seed) — {kg}", "Auto-purged — {n}", "Flagged donors — {n}".
- **Live activity feed:** list of the 7 `activityFeedSeed` lines; every 6 seconds (`setInterval`) rotate: prepend the next line with a fade-in and keep the latest 6. Clean up the interval on unmount.

**Bottom (full width): Donor Reliability table** — Donor · Type · On-time · Packaging · Spoils · **FHRI** · Status. Row for `FHRI < 0.7` highlighted red with badge "⚠ Physical audit required • High-volume cooked restricted". Others green badge "OK".

---

## 11. SHARED COMPONENT CONTRACTS

| Component | Props | Notes |
| --- | --- | --- |
| `FreshnessRing` | `{ value, size=96, showLabel=true }` | SVG circle ring; stroke colour by `urgencyBand(value)`; centre shows `{Math.round(Math.min(value,1)*100)}%` and tiny text "used". Animate stroke-dashoffset with CSS transition (0.6 s). If `value >= 1` show grey ring + "Expired". |
| `UrgencyBadge` | `{ band }` | 🟢 Fresh / 🟠 Urgent / 🔴 Critical / ⚫ Expired pill |
| `StatusChip` | `{ status }` | Uses `STATUS_LABEL`; colours: POSTED slate, MATCHED violet, CLAIMED blue, IN_TRANSIT amber, DELIVERED green, EXPIRED red |
| `StatusStepper` | `{ stage (1–4), labels? }` | Horizontal 4-step tracker; mobile stays horizontal with small labels |
| `OtpPad` | `{ length=4, onSubmit(code) → boolean, title }` | Internal state for digits; on `false` return trigger shake + red state, clear after 600 ms |
| `QrScannerSim` | `{ onScanned }` | Simulated only |
| `FhriGauge` | `{ value }` | 0–0.8 scale visual; threshold tick at 0.70 |
| `RouteTimeline` | `{ stops: [{type:"pickup"\|"drop", label}] }` | Vertical line with icons |
| `Modal` | `{ open, onClose, title, children }` | Esc closes |
| `Stat` | `{ label, value, icon, hint? }` | KPI card |

---

## 12. BUILD ORDER (phases + acceptance checklist)

Complete each phase, run the app, and tick the checklist **before** starting the next.

### Phase 1 — Foundation
Setup commands, Tailwind config, fonts, folder structure, `constants.js`, `decay.js`, `priority.js`, `maxHeap.js`, `fhri.js`, `format.js`, `mockData.js`, `AppContext` (all helpers/actions + safety-intercept effect), `ToastProvider`, routes with placeholder page titles.
- [ ] App runs with no console errors; all routes render a title
- [ ] Test vectors in §6.5 match (temporarily `console.log`, then remove)

### Phase 2 — Shared UI
`ui/*` primitives, `FreshnessRing`, `UrgencyBadge`, `StatusChip`, `StatusStepper`, `OtpPad`, `QrScannerSim`, `FhriGauge`, `RouteTimeline`, `AppShell`, `MobileFrame`, `DemoPanel`.
- [ ] Demo panel temperature slider and +1h / +3h buttons change a visible Dᵢ
- [ ] Rings animate and change colour at 0.4 / 0.7 / 1.0

### Phase 3 — Landing + Donor Portal
- [ ] Role cards navigate correctly
- [ ] Presets → New Donation with correct category preselected
- [ ] Slider converter shows 15 kg ≈ 45 meals for cooked
- [ ] Live ring updates when sliders / ambient temp change
- [ ] Switching to donor **d3** and posting cooked > 10 kg shows the FHRI restriction banner and disables submit
- [ ] Submitting creates a post → passcard with QR + OTP; 3 s later status changes to Matched + toast

### Phase 4 — Recipient Portal
- [ ] Feed order at 32 °C: p2, p1, p4, p3 (see §6.5)
- [ ] Changing headcount re-sorts and re-filters live
- [ ] Claim → modal → confirm → moves to My Claims, appears in driver Available tab
- [ ] Tracking page stepper reflects job state

### Phase 5 — Driver App
- [ ] Seeded batched job j1 shows 2 pickups → Hope Night Shelter, payout ₹113
- [ ] Safety checklist requires all 3 ticks
- [ ] Simulated scan → OTP pad; wrong OTP shakes; correct OTP (4821, 5937) advances
- [ ] After all pickups → delivery phase; dropoff OTP 7305 completes job with success screen
- [ ] Seeded j2 opens straight in delivery phase (OTP 2468)
- [ ] Recipient/donor screens reflect the new statuses

### Phase 6 — Enterprise + Admin
- [ ] Charts render with data; download buttons show toasts
- [ ] Admin map shows 4 donors, 4 NGOs, a dashed animated line for j2 (d1 → n2)
- [ ] Activity feed rotates every 6 s; metrics update when posts change
- [ ] Bake Haven row is red-flagged (FHRI 0.69)

### Phase 7 — Polish & final QA
- [ ] Advance time +3 h → p2 (milk sweets) auto-purges with toast and disappears from recipient feed; "auto-delisted" counter appears
- [ ] Reset demo restores everything
- [ ] Mobile widths (375 px) fine for donor, recipient, driver; no horizontal scrolling
- [ ] No console errors/warnings, no unused imports, no leftover `console.log`
- [ ] No network requests other than Google Fonts (check the browser Network tab)

---

## 13. FEATURE TRACEABILITY (original spec → where it lives)

| Original requirement | Implemented in |
| --- | --- |
| Ambient-aware Decay Index Dᵢ, α per category, delist at Dᵢ ≥ 1 | `decay.js`, safety-intercept effect, `FreshnessRing` |
| Priority P with weights 0.40 / 0.35 / 0.25 and Max-Heap | `priority.js`, `maxHeap.js`, Recipient feed |
| FHRI and audit/restriction below 0.70 | `fhri.js`, Donor dashboard, New Donation, Admin table |
| Finite State Machine with purge | Context actions, `StatusChip`, §8.5 |
| Dual OTP handshake | Donor Passcard (pickup), Recipient Tracking (dropoff), Driver `OtpPad` |
| 1-tap category presets | Donor dashboard + New Donation |
| Smart quantity converter (15 kg ≈ 45 meals) | New Donation |
| Live freshness meter | `FreshnessRing` |
| Packaging kit toggle | New Donation + mock checkout modal |
| Digital passcard (QR + OTP) | Passcard page |
| Capacity headcount filter | Recipient feed |
| Colour-coded urgency cards | `ListingCard`, `UrgencyBadge` |
| 1-tap claim & lock | Recipient feed claim flow |
| Real-time 4-stage status bar | `StatusStepper` |
| Batched route display | Driver home, `RouteTimeline` |
| Scanner & OTP pad | `QrScannerSim`, `OtpPad` |
| Safety inspection checklist (3-point) | Driver accept modal |
| CSR impact panel + 80G receipts | Enterprise dashboard |
| Dark-mode system map with pulse rings and transit vectors | Admin map |
| Micro-payouts per km | Driver job cards (₹12/km) |
| Digital liability waiver | New Donation checkbox + Passcard footer |
| Sweet shop / bakery categories | `CATEGORIES`, mock data |

---

## 14. FINAL DON'T LIST (re-read before finishing)

- ❌ No backend, API calls, auth, payments, real camera, real maps, real weather
- ❌ No TypeScript, no Tailwind v4, no extra UI libraries
- ❌ No invented features, pages, or data fields beyond this file
- ❌ No remote images, no lorem ipsum, no TODOs
- ❌ Don't change the formulas, weights, thresholds, or seed data
- ❌ Don't persist to localStorage
- ✅ Everything works offline after first load (except Google Fonts)
- ✅ Every role's flow is demoable end to end in one browser tab using the Demo Panel

---

## 15. SUGGESTED DEMO SCRIPT (for presentation day)

1. **Landing** → explain the problem and the 5 roles.
2. **Donor** → post 15 kg cooked meals; show the converter, live freshness ring, and the passcard QR + pickup OTP.
3. **Demo Panel** → raise ambient temperature to 38 °C and watch Dᵢ climb (explain the decay formula).
4. **Recipient** → show best-match ordering (Max-Heap), change headcount, claim a batch.
5. **Driver** → accept batched job, safety checklist, simulated scan, enter pickup OTPs, enter dropoff OTP.
6. **Recipient tracking** → stepper shows Delivered ✓.
7. **Demo Panel +3 h** → watch the milk-sweets listing auto-purge (safety intercept).
8. **Enterprise** → CSR charts and 80G receipts.
9. **Admin** → system map, activity feed, flagged donor (FHRI 0.69).

*Team split suggestion:* Member 1 – Donor UI & freshness meter · Member 2 – formulas, state machine, OTP logic · Member 3 – Enterprise/CSR & business story · Member 4 – Driver safety checklist, expiry handling, audit flags.
