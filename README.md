# 🌉 MealBridge

> **Connecting Surplus Food with Real Need through Smart Logistics.**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

MealBridge is an end-to-end food rescue platform that connects commercial food donors (hotels, caterers, banquet halls, sweet shops, bakeries) with verified recipient organizations (shelters, orphanages, community kitchens) through on-demand delivery drivers and volunteers.

---

## 🎨 UI/UX Philosophy: Minimalist & Focused

The UI is designed to be **uncluttered, clean, and deeply intuitive**, drawing inspiration from modern minimalist luxury interfaces and rich culinary palettes:
- **Dedicated Focused Pages**: Distinct, purpose-built pages for each feature so users are never overwhelmed.
- **Glassmorphism & Floating Cards**: Soft frosted glass effects (`backdrop-blur-md`), rounded containers (`rounded-3xl`), and subtle micro-shadows.
- **Organic Typography**: Paired with *Plus Jakarta Sans* for bold, confident headings and *Inter* for crisp, legible body text.
- **Micro-Interactions**: Dynamic SVG freshness rings, animated scan lines, interactive OTP numeric keypad, and live transit telemetry.

---

## 📐 Mathematical & Engineering Formulations

MealBridge features deterministic ISE algorithmic calculations computed directly client-side:

### 1. Ambient-Aware Decay Index ($D_i$)
Quantifies food degradation velocity based on elapsed time ($t_{\text{elapsed}}$), category-specific shelf-life ($T_{\text{max}}$), thermal decay factor ($\alpha$), and ambient temperature ($T_{\text{ambient}}$):

$$D_i = \left(\frac{t_{\text{elapsed}}}{T_{\text{max}}}\right) \times \left[ 1 + \alpha \times \max\left(0, \frac{T_{\text{ambient}} - T_{\text{base}}}{T_{\text{base}}}\right) \right]$$

- Baseline temperature $T_{\text{base}} = 25^\circ\text{C}$
- **Freshness Bands**:
  - $D_i < 0.40$: 🟢 **Fresh**
  - $0.40 \le D_i \le 0.70$: 🟠 **Urgent**
  - $0.70 < D_i < 1.00$: 🔴 **Critical**
  - $D_i \ge 1.00$: ⚫ **Expired (Automated Safety Purge)**

### 2. Algorithmic Priority Score ($P$) via Binary Max-Heap
Matches surplus batches to recipient organizations using multi-objective optimization:

$$P = w_1 \times \left(\frac{1}{\max(\text{distance}_{\text{km}}, 1)}\right) + w_2 \times \min(D_i, 1) + w_3 \times \min\left(1, \frac{\text{headcount}}{\text{meals}}\right)$$

- Proximity Weight ($w_1 = 0.40$)
- Urgency Weight ($w_2 = 0.35$)
- Portion Match Weight ($w_3 = 0.25$)
- Ranked efficiently using an array-based **Binary Max-Heap** (`MaxHeap`).

### 3. Food Hygiene & Reliability Index (FHRI)
Monitors donor safety compliance and prevents high-volume risk:

$$\text{FHRI} = 0.50 \times \text{onTime} + 0.30 \times \text{packaging} - 0.20 \times \text{spoils}$$

- Donors with $\text{FHRI} < 0.70$ are flagged for physical audit and restricted from posting cooked meal batches $> 10\text{ kg}$.

### 4. Dual OTP Handshake & FSM Lifecycle
Ensures an unbroken digital chain of custody:
```
[POSTED] ──(3s Auto-Match)──> [MATCHED] ──(Claim & Lock)──> [CLAIMED]
                                                                  │
                                                          (Pickup OTP)
                                                                  ▼
[DELIVERED_VERIFIED] <──(Dropoff OTP)── [IN_TRANSIT]
```
- **Automated Safety Intercept**: Any batch reaching $D_i \ge 1.0$ in `POSTED`, `MATCHED`, or `CLAIMED` state is instantly auto-purged from public feeds.

---

## 🚀 Features & Page Directory

| Route | Role | Description |
|---|---|---|
| `/` | **Landing Page** | Overview of the 4-step protocol and role selector. |
| `/donor` | **Donor Dashboard** | KPI statistics, 1-tap presets, active batches, and mock packaging checkout. |
| `/donor/new` | **New Donation Form** | Live freshness preview ring, smart quantity converter (kg $\to$ meals), liability waiver. |
| `/donor/passcard/:id` | **Digital Passcard** | Dynamic QR code and 4-digit Pickup OTP for driver handover. |
| `/donor/history` | **Donation History** | Full audit trail of past and completed donations. |
| `/recipient` | **Recipient Hub** | Live Max-Heap prioritized feed, capacity headcount stepper, and batch locking. |
| `/recipient/tracking/:id` | **Live Tracking** | 4-stage lifecycle tracker with 4-digit Dropoff OTP and driver details. |
| `/driver` | **Driver Fleet App** | Mobile-first console, batched routes, payout calculation (₹12/km), and 3-point safety inspection. |
| `/driver/job/:id` | **Driver Job Console** | Simulated camera QR viewfinder, numeric OTP keypad, and delivery verification. |
| `/enterprise` | **Enterprise CSR** | ESG impact reports, Recharts monthly trend visualizations, and 80G tax receipts. |
| `/admin` | **System Control Room** | Dark-mode SVG topology map with transit vectors, live telemetry, and FHRI audit matrix. |

---

## 🎛 Floating Demo Control Panel

Accessible on all portal pages (bottom-left floating pill):
1. **Ambient Temperature Slider**: Adjust from $20^\circ\text{C}$ to $42^\circ\text{C}$ to watch decay index and freshness rings update live.
2. **Time Travel Fast-Forward**: Accelerate time by `+1h` or `+3h` to trigger the finite-state machine auto-purge on expiring batches.
3. **Act As Donor**: Switch acting commercial donor (e.g. switch to Bake Haven to inspect FHRI audit restriction).
4. **Seeded OTP Reference**: Quick access to all seeded pickup and dropoff OTPs.
5. **Reset Demo**: Restore application state back to seed baseline in 1 click.

---

## 🛠 Local Setup & Running

```bash
# Clone repository
git clone https://github.com/divyanshbuilds30/Meal_Bridge.git
cd Meal_Bridge

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to interact with the full prototype!
