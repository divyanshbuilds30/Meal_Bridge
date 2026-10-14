const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({
  size: 'A4',
  layout: 'landscape',
  margins: { top: 32, bottom: 32, left: 40, right: 40 },
  bufferPages: true,
});

const outputPath = path.join(__dirname, 'MealBridge_Project_Presentation_Analysis.pdf');
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Color Palette
const COLORS = {
  primary: '#16A34A',      // Brand Green
  primaryDark: '#14532D',
  primaryLight: '#F0FDF4',
  primaryBorder: '#BBF7D0',
  ink: '#0F172A',           // Dark text
  slateDark: '#334155',
  slateMed: '#64748B',
  slateLight: '#F8FAFC',
  slateBorder: '#E2E8F0',
  amber: '#D97706',
  amberLight: '#FFFBEB',
  amberBorder: '#FDE68A',
  blue: '#2563EB',
  blueLight: '#EFF6FF',
  blueBorder: '#BFDBFE',
  red: '#DC2626',
  redLight: '#FEF2F2',
  redBorder: '#FECACA',
  nightBg: '#0B1220',
  nightCard: '#111B2E',
  neonGreen: '#22C55E',
  neonCyan: '#22D3EE',
  white: '#FFFFFF',
};

const MEMBER_COLORS = {
  1: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', name: 'Member 1: Vision & Donor Portal' },
  2: { bg: '#FDF2F8', text: '#BE185D', border: '#FBCFE8', name: 'Member 2: Math, Algorithms & FSM' },
  3: { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A', name: 'Member 3: Recipient & Driver Logistics' },
  4: { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0', name: 'Member 4: Enterprise CSR, Admin & Demo' },
};

function drawSlideHeader(slideNum, totalSlides, title, subtitle, memberNum) {
  // Top bar line
  doc.rect(40, 32, 762, 3).fill(COLORS.primary);

  // Slide Number Pill
  doc.roundedRect(40, 42, 60, 20, 6).fillAndStroke(COLORS.slateLight, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.slateMed)
    .text(`SLIDE ${slideNum}/${totalSlides}`, 40, 47, { width: 60, align: 'center' });

  // Member Badge
  if (memberNum && MEMBER_COLORS[memberNum]) {
    const m = MEMBER_COLORS[memberNum];
    doc.roundedRect(108, 42, 230, 20, 6).fillAndStroke(m.bg, m.border);
    doc.font('Helvetica-Bold').fontSize(9).fillColor(m.text)
      .text(`🎤 ${m.name}`, 114, 47, { width: 220, align: 'left' });
  }

  // Right Tag
  doc.font('Helvetica').fontSize(9).fillColor(COLORS.slateMed)
    .text('MealBridge ISE IDT Project Presentation', 550, 47, { width: 250, align: 'right' });

  // Slide Title & Subtitle
  doc.font('Helvetica-Bold').fontSize(18).fillColor(COLORS.ink)
    .text(title, 40, 72, { width: 760 });
  doc.font('Helvetica').fontSize(10).fillColor(COLORS.slateMed)
    .text(subtitle, 40, 94, { width: 760 });

  // Divider
  doc.moveTo(40, 112).lineTo(802, 112).strokeColor(COLORS.slateBorder).lineWidth(1).stroke();
}

function drawSpeakerNotes(yPos, scriptText, duration = '2 mins', tips = '') {
  const boxHeight = 95;
  doc.roundedRect(40, yPos, 762, boxHeight, 8)
    .fillAndStroke(COLORS.primaryLight, COLORS.primaryBorder);

  doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.primaryDark)
    .text(`🎙️ SPEAKER SCRIPT & DELIVERY CUES (Target Duration: ${duration})`, 52, yPos + 8);

  doc.font('Helvetica-Oblique').fontSize(8.5).fillColor(COLORS.slateDark)
    .text(`"${scriptText}"`, 52, yPos + 22, { width: 738, lineGap: 2 });

  if (tips) {
    doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.primary)
      .text(`💡 Delivery Tip: `, 52, yPos + 78, { continued: true })
      .font('Helvetica').fontSize(8).fillColor(COLORS.slateMed)
      .text(tips);
  }
}

// ==========================================
// COVER SLIDE
// ==========================================
function renderCoverSlide() {
  // Background styling
  doc.rect(0, 0, 842, 595).fill('#F8FAFC');

  // Decorative header strip
  doc.rect(0, 0, 842, 8).fill(COLORS.primary);

  // Main Card
  doc.roundedRect(50, 45, 742, 505, 16)
    .fillAndStroke(COLORS.white, COLORS.slateBorder);

  // Badge
  doc.roundedRect(70, 75, 230, 24, 12)
    .fillAndStroke(COLORS.primaryLight, COLORS.primaryBorder);
  doc.font('Helvetica-Bold').fontSize(10).fillColor(COLORS.primaryDark)
    .text('🌉 ISE IDT CAPSTONE PROJECT', 70, 82, { width: 230, align: 'center' });

  // Main Title
  doc.font('Helvetica-Bold').fontSize(34).fillColor(COLORS.ink)
    .text('MealBridge: Smart Food Rescue Protocol', 70, 115, { width: 700 });

  doc.font('Helvetica-Bold').fontSize(14).fillColor(COLORS.primary)
    .text('Connecting Commercial Surplus with Real Need through Algorithmic Logistics', 70, 158);

  doc.font('Helvetica').fontSize(10.5).fillColor(COLORS.slateMed)
    .text('A comprehensive presentation & technical analysis of the 4-tier ISE architecture, mathematical decay modeling, binary max-heap priority matching, and dual OTP physical custody verification.', 70, 180, { width: 700, lineGap: 3 });

  // 4 Team Members Distribution Box
  doc.roundedRect(70, 225, 702, 210, 12)
    .fillAndStroke(COLORS.slateLight, COLORS.slateBorder);

  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.ink)
    .text('👥 4-Member Presentation Allocation & Role Breakdown', 90, 240);

  const teamMembers = [
    {
      num: 1,
      title: 'Member 1: Vision, Problem & Donor Portal',
      slides: 'Slides 1 – 3',
      topics: 'Food waste paradox, commercial kitchen challenges, 1-tap presets, smart converter (kg to meals), live freshness ring & digital liability waiver.',
      color: MEMBER_COLORS[1],
    },
    {
      num: 2,
      title: 'Member 2: Math, Algorithms & FSM Protocol',
      slides: 'Slides 4 – 6',
      topics: 'Thermal-aware Decay Index (Di) derivation, multi-objective Priority Score (P), Binary Max-Heap ranking, Finite State Machine & automated safety purge.',
      color: MEMBER_COLORS[2],
    },
    {
      num: 3,
      title: 'Member 3: Recipient Hub & Fleet Logistics',
      slides: 'Slides 7 – 9',
      topics: 'Recipient headcount capacity filtering, instant batch locking, mobile-first driver app, batched routing, ₹12/km payouts & 3-point inspection.',
      color: MEMBER_COLORS[3],
    },
    {
      num: 4,
      title: 'Member 4: Enterprise CSR, Admin & Live Demo',
      slides: 'Slides 10 – 12',
      topics: 'Corporate ESG metrics, Scope 3 landfill CO2e offset, Section 80G certificates, dark-mode SVG telemetry map, FHRI audit matrix & interactive demo.',
      color: MEMBER_COLORS[4],
    },
  ];

  teamMembers.forEach((tm, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 90 + col * 345;
    const y = 268 + row * 76;

    doc.roundedRect(x, y, 330, 68, 8)
      .fillAndStroke(tm.color.bg, tm.color.border);

    doc.font('Helvetica-Bold').fontSize(10).fillColor(tm.color.text)
      .text(tm.title, x + 10, y + 8);
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.slateMed)
      .text(`Assigned: ${tm.slides}`, x + 10, y + 22);
    doc.font('Helvetica').fontSize(8).fillColor(COLORS.slateDark)
      .text(tm.topics, x + 10, y + 35, { width: 310, lineGap: 1.5 });
  });

  // Footer on cover
  doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.slateMed)
    .text('Prototype Status: Production Ready • Node.js / React 18 / Tailwind / Vite • Localhost:3000 Active', 70, 465);
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.slateMed)
    .text('Single Source of Truth: MEALBRIDGE_FRONTEND_SPEC.md • Repository: github.com/divyanshbuilds30/Meal_Bridge', 70, 482);
}

// ==========================================
// SLIDE 1 (Member 1)
// ==========================================
function renderSlide1() {
  drawSlideHeader(
    1, 12,
    'The Problem: Why Traditional Food Donation Fails at Scale',
    'Systemic barriers in commercial surplus food redistribution: The perishability paradox, liability fears, and logistics friction.',
    1
  );

  // Column 1: The Perishability Paradox
  doc.roundedRect(40, 125, 240, 310, 10).fillAndStroke(COLORS.slateLight, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.red).text('⚠️ The Perishability Paradox', 55, 140);
  doc.font('Helvetica').fontSize(9).fillColor(COLORS.slateDark).text(
    `• Over 67 million tonnes of food is wasted annually in India, while commercial hotels and caterers discard wholesome surplus daily.\n\n` +
    `• Cooked and milk-sweet items spoil rapidly under Indian tropical ambient temperatures (30°C–42°C).\n\n` +
    `• Traditional charities rely on manual phone calls and ad-hoc pickups taking 4–8 hours—by which time microbial growth renders the food hazardous.\n\n` +
    `• Result: Commercial kitchens choose landfills over donation to eliminate food poisoning risks.`,
    55, 165, { width: 210, lineGap: 3 }
  );

  // Column 2: Legal & Trust Friction
  doc.roundedRect(300, 125, 240, 310, 10).fillAndStroke(COLORS.slateLight, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.amber).text('⚖️ Legal & Quality Skepticism', 315, 140);
  doc.font('Helvetica').fontSize(9).fillColor(COLORS.slateDark).text(
    `• Lack of Legal Shield: Donors fear criminal negligence liability if donated food causes illness downstream.\n\n` +
    `• Absence of Hygiene Verification: Recipient NGOs have no visibility into the donor's sanitary track record or food preparation timestamps.\n\n` +
    `• Tampering in Transit: Conventional open delivery lacks tamper-evident packaging or digital custody receipts.\n\n` +
    `• Tax Disconnect: Commercial entities rarely receive legitimate 80G tax exemption certificates for in-kind food donations.`,
    315, 165, { width: 210, lineGap: 3 }
  );

  // Column 3: Logistics Breakdown
  doc.roundedRect(560, 125, 242, 310, 10).fillAndStroke(COLORS.slateLight, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.blue).text('🚚 Logistics Coordination Void', 575, 140);
  doc.font('Helvetica').fontSize(9).fillColor(COLORS.slateDark).text(
    `• No Dedicated Fleet: Volunteer organizations cannot afford full-time couriers; commercial gig apps (Swiggy/Zomato) charge commercial rates.\n\n` +
    `• Route Inefficiency: Multiple small pickups are rarely aggregated into batched routes, causing extreme delivery cost per kg.\n\n` +
    `• Capacity Mismatch: A donor with 50 kg of biryani connects with a 15-person shelter, wasting 70% of the food, while a 200-child orphanage goes hungry.\n\n` +
    `• The MealBridge Solution: Algorithmic coordination with deterministic safety guarantees.`,
    575, 165, { width: 212, lineGap: 3 }
  );

  drawSpeakerNotes(
    450,
    "Good morning judges and professors. I will kick off our presentation by addressing why surplus food waste persists despite immense hunger. Commercial kitchens produce tonnes of perfectly safe food every evening. But they face a trilemma: first, thermal perishability—in hot weather, food rots within hours; second, legal paranoia—without a verified waiver, donors fear liability; and third, logistics failure—shelters lack drivers. MealBridge solves this through algorithmic ISE principles.",
    "2 mins",
    "Set an urgent, passionate tone. Emphasize that this is not an awareness problem—it is an information and logistics systems engineering challenge."
  );
}

// ==========================================
// SLIDE 2 (Member 1)
// ==========================================
function renderSlide2() {
  drawSlideHeader(
    2, 12,
    'MealBridge Paradigm: The 5-Portal Integrated Architecture',
    'A unified, decentralized ecosystem connecting Donors, NGOs, Delivery Partners, Enterprises, and Mission Control.',
    1
  );

  // Architecture Box Layout
  const portals = [
    { icon: '🏨', name: 'Commercial Donor', desc: 'Hotels, caterers & sweet shops. 1-tap presets, smart kg-to-meal converter, live freshness preview ring, digital passcards with Pickup OTP.', bg: COLORS.primaryLight, border: COLORS.primaryBorder },
    { icon: '🏠', name: 'Recipient NGO Hub', desc: 'Verified shelters & orphanages. Binary Max-Heap prioritized feed, dynamic capacity headcount filter, 1-tap batch locking & live tracking.', bg: COLORS.blueLight, border: COLORS.blueBorder },
    { icon: '🚚', name: 'Delivery Fleet App', desc: 'Gig couriers & volunteers. Mobile-first console, batched multi-pickup routes, ₹12/km micro-payouts, simulated QR scanner & OTP pad.', bg: COLORS.amberLight, border: COLORS.amberBorder },
    { icon: '🏢', name: 'Enterprise CSR', desc: 'Corporate sponsors & sustainability teams. Live ESG impact dashboards, Scope 3 landfill avoided CO2e metrics & downloadable 80G tax receipts.', bg: '#FAF5FF', border: '#E9D5FF' },
    { icon: '🛰️', name: 'Admin Mission Control', desc: 'Real-time telemetry room. Spatial SVG topology map, animated transit vectors, pulsing active nodes, live dispatch stream & FHRI reliability matrix.', bg: '#F1F5F9', border: '#CBD5E1' },
  ];

  portals.forEach((p, idx) => {
    const x = 40 + idx * 154;
    doc.roundedRect(x, 125, 146, 175, 10).fillAndStroke(p.bg, p.border);
    doc.font('Helvetica-Bold').fontSize(24).text(p.icon, x + 12, 138);
    doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.ink).text(p.name, x + 12, 170, { width: 122 });
    doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.slateDark).text(p.desc, x + 12, 202, { width: 122, lineGap: 2 });
  });

  // End-to-end Lifecycle Banner
  doc.roundedRect(40, 312, 762, 125, 10).fillAndStroke(COLORS.slateLight, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.primaryDark).text('🔄 The 4-Stage Digital Chain of Custody Protocol', 55, 324);

  const steps = [
    { num: '01', title: 'Post Surplus', desc: 'Commercial donor logs weight & category; system computes Decay Index (Di) live.' },
    { num: '02', title: 'Algorithmic Match', desc: 'Binary Max-Heap ranks verified NGOs by proximity, urgency, and capacity in 3 seconds.' },
    { num: '03', title: 'Pickup Handshake', desc: 'Driver performs 3-point digital safety check, scans Passcard QR, and enters donor OTP.' },
    { num: '04', title: 'Dropoff & 80G', desc: 'NGO verifies batch condition, enters Dropoff OTP, and generates Section 80G tax receipt.' },
  ];

  steps.forEach((s, idx) => {
    const sx = 55 + idx * 186;
    doc.roundedRect(sx, 345, 174, 80, 8).fillAndStroke(COLORS.white, COLORS.slateBorder);
    doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.primary).text(`STEP ${s.num}`, sx + 10, 355);
    doc.font('Helvetica-Bold').fontSize(9.5).fillColor(COLORS.ink).text(s.title, sx + 10, 372);
    doc.font('Helvetica').fontSize(8).fillColor(COLORS.slateMed).text(s.desc, sx + 10, 388, { width: 154, lineGap: 1.5 });
  });

  drawSpeakerNotes(
    450,
    "Here you see the architecture of MealBridge. Rather than building a generic marketplace, we engineered 5 specialized interfaces designed around their operational workflows. Notice how each persona interacts through an immutable chain of custody: the commercial donor creates a passcard with an encrypted pickup OTP; the system matches in 3 seconds; the driver conducts a safety checklist; and the NGO signs off with a dropoff OTP.",
    "2 mins",
    "Gesture towards the step sequence (01 to 04) to demonstrate how data moves seamlessly from donor to NGO."
  );
}

// ==========================================
// SLIDE 3 (Member 1)
// ==========================================
function renderSlide3() {
  drawSlideHeader(
    3, 12,
    'Donor Experience: 1-Tap Presets, Live Decay & Passcard',
    'Minimizing commercial friction: How kitchen managers log donations in under 30 seconds with automated freshness validation.',
    1
  );

  // Left Box: 1-Tap Presets & Smart Converter
  doc.roundedRect(40, 125, 370, 310, 10).fillAndStroke(COLORS.white, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.ink).text('⚡ Frictionless Kitchen Input Experience', 55, 140);
  doc.font('Helvetica').fontSize(9).fillColor(COLORS.slateDark).text(
    `1. 1-Tap Category Presets:\n` +
    `   • Cooked Meals (🍛 tMax: 6h, α: 0.4, 3 meals/kg) — Hot/Ambient storage\n` +
    `   • Milk Sweets (🍮 tMax: 6h, α: 0.6, 4 meals/kg) — Cold Chain Required (4°C–10°C)\n` +
    `   • Bakery & Snacks (🥐 tMax: 12h, α: 0.15, 5 meals/kg) — Room Temp\n` +
    `   • Dry Sweets (🍬 tMax: 48h, α: 0.05, 6 meals/kg) — Dry Ambient\n\n` +
    `2. Smart Quantity Converter:\n` +
    `   • Kitchen chefs think in kilograms (e.g., 15 kg biryani container).\n` +
    `   • Real-time visual feedback instantly computes: 15 kg ≈ 45 nutritious meals.\n\n` +
    `3. Digital Liability Waiver & Tamper-Evident Packaging:\n` +
    `   • Statutory Good Samaritan protection checkmark protects donors from legal liability.\n` +
    `   • Optional add-on: MealBridge tamper-evident packaging kits (₹15/kit, 1 kit per 2 kg) added seamlessly to monthly corporate invoices.`,
    55, 160, { width: 340, lineGap: 3 }
  );

  // Right Box: Live Freshness Preview & Passcard
  doc.roundedRect(430, 125, 372, 310, 10).fillAndStroke(COLORS.white, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.primaryDark).text('📱 Live Freshness Preview & Passcard Output', 445, 140);
  doc.font('Helvetica').fontSize(9).fillColor(COLORS.slateDark).text(
    `4. Sticky Live Freshness Ring Preview:\n` +
    `   • Dynamic circular SVG meter recalculates Decay Index (Di) in real time.\n` +
    `   • Color-coded urgency bands:\n` +
    `     - Di < 0.40: 🟢 Fresh (Safe window ample)\n` +
    `     - 0.40 ≤ Di ≤ 0.70: 🟠 Urgent (Dispatch prioritized)\n` +
    `     - 0.70 < Di < 1.00: 🔴 Critical (Immediate driver alert)\n` +
    `     - Di ≥ 1.00: ⚫ Expired (Posting automatically disabled!)\n\n` +
    `5. Instant Digital Passcard Generation:\n` +
    `   • On submit, system generates a high-contrast ticket passcard.\n` +
    `   • Contains an encrypted QR code (MEALBRIDGE|POST:id|PICKUP) and a large 4-digit Pickup OTP displayed in separate digit boxes.\n` +
    `   • Driver cannot take physical custody without donor revealing this OTP.`,
    445, 160, { width: 342, lineGap: 3 }
  );

  drawSpeakerNotes(
    450,
    "In the Donor Portal, user experience was our top priority. Chefs do not have time for complex forms. We implemented 1-tap category presets and a Smart Converter that instantly translates 15 kg into 45 meals. The sticky live preview shows the exact freshness percentage based on ambient temperature. When submitted, a digital passcard with a QR code and a 4-digit OTP is generated. Now I hand over to Member 2 to explain the core mathematics and state machine behind this freshness ring.",
    "2 mins",
    "Hand off cleanly to Member 2: 'Now Member 2 will dive deep into the mathematical models powering this freshness meter and our algorithmic matching engine.'"
  );
}

// ==========================================
// SLIDE 4 (Member 2)
// ==========================================
function renderSlide4() {
  drawSlideHeader(
    4, 12,
    'The Physics of Decay: Thermal-Aware Decay Index (Di)',
    'A deterministic mathematical formulation quantifying microbiological degradation velocity as a function of temperature.',
    2
  );

  // Formula Card
  doc.roundedRect(40, 125, 762, 90, 10).fillAndStroke(COLORS.primaryLight, COLORS.primaryBorder);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.primaryDark)
    .text('📐 Ambient-Aware Decay Index Formulation', 55, 137);

  doc.font('Helvetica-Bold').fontSize(16).fillColor(COLORS.ink)
    .text('Dᵢ = ( t_elapsed / T_max ) × [ 1 + α × max(0, (T_ambient − T_base) / T_base) ]', 55, 158, { width: 730, align: 'center' });

  doc.font('Helvetica').fontSize(9).fillColor(COLORS.slateMed)
    .text('Where: t_elapsed = elapsed hours, T_max = maximum safe lifespan, T_base = 25°C baseline, α = category thermal coefficient, T_ambient = current temperature.', 55, 186, { width: 730, align: 'center' });

  // Left Column: Parameter Analysis
  doc.roundedRect(40, 225, 370, 210, 10).fillAndStroke(COLORS.white, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.ink).text('🔬 Thermal Sensitivity Coefficient (α)', 55, 238);
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.slateDark).text(
    `Different food matrices exhibit radically different bacterial growth rates under heat:\n\n` +
    `• Milk Sweets (α = 0.60): Highest sensitivity. Rich in lactose and moisture, vulnerable to rapid lactic acid fermentation.\n\n` +
    `• Cooked Meals (α = 0.40): High sensitivity. Cooked gravies and rice enter the danger zone (5°C–60°C) where Bacillus cereus multiplies exponentially.\n\n` +
    `• Bakery & Fried Snacks (α = 0.15): Moderate sensitivity. Low water activity limits bacterial propagation.\n\n` +
    `• Dry Sweets (α = 0.05): Low sensitivity. High sugar concentration creates osmotic pressure inhibiting microbial action.`,
    55, 258, { width: 340, lineGap: 2.5 }
  );

  // Right Column: Test Vector Proof Matrix
  doc.roundedRect(430, 225, 372, 210, 10).fillAndStroke(COLORS.white, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.ink).text('✅ Verified Spec Test Vectors at 32°C (Thermal Term = 0.28)', 445, 238);

  const testVectors = [
    { post: 'p1 Cooked Meals', time: '2.0 h', di: '0.371', band: '🟢 Fresh', note: 'Safe window 6h' },
    { post: 'p2 Milk Sweets', time: '4.0 h', di: '0.779', band: '🔴 Critical', note: 'Fast decay rate' },
    { post: 'p3 Bakery Snacks', time: '3.0 h', di: '0.261', band: '🟢 Fresh', note: 'Safe window 12h' },
    { post: 'p4 Wedding Curry', time: '3.5 h', di: '0.649', band: '🟠 Urgent', note: 'High volume' },
    { post: 'p9 Rabri (Old)', time: '7.0 h', di: '1.363', band: '⚫ Expired', note: 'Auto-Purged!' },
  ];

  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.slateMed).text('Item / Category          Elapsed       Dᵢ Value       Band             System Action', 445, 258);
  doc.moveTo(445, 270).lineTo(785, 270).strokeColor(COLORS.slateBorder).lineWidth(0.5).stroke();

  testVectors.forEach((tv, idx) => {
    const y = 276 + idx * 26;
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.ink).text(tv.post, 445, y);
    doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.slateDark).text(tv.time, 550, y);
    doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.primary).text(tv.di, 605, y);
    doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.slateDark).text(tv.band, 660, y);
    doc.font('Helvetica-Oblique').fontSize(8).fillColor(COLORS.slateMed).text(tv.note, 730, y);
  });

  drawSpeakerNotes(
    450,
    "Thank you Member 1. As Industrial and Systems Engineers, we know that arbitrary countdown timers fail because food degradation is fundamentally non-linear and ambient-dependent. We derived the Decay Index Di. Notice the thermal velocity term: when ambient temperature rises above our 25°C baseline, degradation accelerates by alpha. For milk sweets, alpha is 0.60, whereas for dry sweets it is only 0.05. Our running code produces exact mathematical matches to our test vectors, such as p2 reaching 0.779 critical.",
    "2 mins",
    "Point to the formula and explain why milk sweets (alpha=0.6) decay much faster than bakery goods (alpha=0.15)."
  );
}

// ==========================================
// SLIDE 5 (Member 2)
// ==========================================
function renderSlide5() {
  drawSlideHeader(
    5, 12,
    'Algorithmic Matching: Multi-Objective Priority & Max-Heap',
    'O(log N) optimal resource allocation balancing spatial proximity, food urgency, and organizational capacity.',
    2
  );

  // Top Formula
  doc.roundedRect(40, 125, 762, 80, 10).fillAndStroke(COLORS.blueLight, COLORS.blueBorder);
  doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.blue).text('🎯 Multi-Objective Priority Objective Function (P)', 55, 137);
  doc.font('Helvetica-Bold').fontSize(15).fillColor(COLORS.ink)
    .text('P = w₁ · ( 1 / max(d_km, 1) ) + w₂ · min(Dᵢ, 1) + w₃ · min( 1, headcount / meals )', 55, 155, { width: 730, align: 'center' });
  doc.font('Helvetica').fontSize(9).fillColor(COLORS.slateMed)
    .text('Weights: w₁ = 0.40 (Spatial Proximity) • w₂ = 0.35 (Urgency Index) • w₃ = 0.25 (Headcount Portion Fit). Distance clamped to min 1 km.', 55, 178, { width: 730, align: 'center' });

  // Left Column: Weight Tradeoff Analysis
  doc.roundedRect(40, 215, 370, 220, 10).fillAndStroke(COLORS.white, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.ink).text('⚖️ Weight Tradeoff Rationale', 55, 228);
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.slateDark).text(
    `Why this exact linear weighting structure?\n\n` +
    `1. Proximity Term (w₁ = 0.40):\n` +
    `   • 1/d prioritizes close shelters to minimize delivery transit time and courier expense.\n` +
    `   • Clamped to min 1 km to prevent numerical divergence as distance approaches 0.\n\n` +
    `2. Urgency Term (w₂ = 0.35):\n` +
    `   • Directly coupled with Decay Index (Di). Food nearing its critical threshold jumps to the top of the heap to avoid waste.\n\n` +
    `3. Portion Match Term (w₃ = 0.25):\n` +
    `   • min(1, headcount/meals) maximizes utility. If an orphanage has 50 children and the post has 50 meals, score is 1.0. A 200-meal post going to a 10-person shelter is penalized.`,
    55, 248, { width: 340, lineGap: 2.2 }
  );

  // Right Column: Max-Heap Architecture & Asha Kiran Proof
  doc.roundedRect(430, 215, 372, 220, 10).fillAndStroke(COLORS.white, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.ink).text('🌲 Binary Max-Heap & Asha Kiran (n1) Live Ranking', 445, 228);

  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.slateDark).text(
    `Array-Based Binary Max-Heap Data Structure:\n` +
    `• Parent at (i-1)>>1; Children at 2i+1 and 2i+2.\n` +
    `• push() performs bubble-up in O(log N); pop() reheapifies in O(log N).\n` +
    `• Enables instant top-match retrieval even with thousands of active city nodes.`,
    445, 246, { width: 340, lineGap: 2 }
  );

  const heapRankings = [
    { rank: 'Rank 1 ⭐', post: 'p2 Rasgulla (Milk Sweets)', dist: '1.2 km', meals: '24', p: '0.856' },
    { rank: 'Rank 2', post: 'p1 Veg Biryani (Cooked)', dist: '2.4 km', meals: '45', p: '0.546' },
    { rank: 'Rank 3', post: 'p4 Wedding Curry (Cooked)', dist: '6.3 km', meals: '75', p: '0.457' },
    { rank: 'Rank 4', post: 'p3 Assorted Buns (Bakery)', dist: '3.5 km', meals: '40', p: '0.455' },
  ];

  doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.slateMed).text('Rank         Batch / Item                     Distance     Meals      Priority Score P', 445, 312);
  doc.moveTo(445, 322).lineTo(785, 322).strokeColor(COLORS.slateBorder).lineWidth(0.5).stroke();

  heapRankings.forEach((hr, idx) => {
    const y = 328 + idx * 24;
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.primaryDark).text(hr.rank, 445, y);
    doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.ink).text(hr.post, 495, y);
    doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.slateMed).text(hr.dist, 640, y);
    doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.slateMed).text(hr.meals, 695, y);
    doc.font('Helvetica-Bold').fontSize(9.5).fillColor(COLORS.primary).text(hr.p, 740, y);
  });

  drawSpeakerNotes(
    450,
    "Next, how do we match thousands of donations with shelters? We implemented a multi-objective Priority Score P using 40% proximity, 35% urgency, and 25% headcount portion match. To sort this in real time, we built a custom Binary Max-Heap class in JavaScript. Look at the Asha Kiran Orphanage test vector: p2 milk sweets ranks #1 with P = 0.856 because it is only 1.2 km away and highly urgent. Our heap outputs this instantly in O(log N) time.",
    "2 mins",
    "Highlight that the Max-Heap is implemented in pure data structures (not just Array.sort), emphasizing computer science rigor."
  );
}

// ==========================================
// SLIDE 6 (Member 2)
// ==========================================
function renderSlide6() {
  drawSlideHeader(
    6, 12,
    'Finite State Machine (FSM), Safety Purge & Dual OTP',
    'Guaranteed food safety through automated state intercepts and cryptographic dual OTP handshakes.',
    2
  );

  // FSM Flow Diagram
  doc.roundedRect(40, 125, 762, 105, 10).fillAndStroke(COLORS.slateLight, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.ink).text('🔄 The Finite State Machine Lifecycle & Allowed Transitions', 55, 137);

  const fsmSteps = [
    { name: 'POSTED', color: '#64748B', bg: '#F1F5F9' },
    { name: 'MATCHED', color: '#7C3AED', bg: '#F5F3FF' },
    { name: 'CLAIMED', color: '#2563EB', bg: '#EFF6FF' },
    { name: 'IN_TRANSIT', color: '#D97706', bg: '#FFFBEB' },
    { name: 'DELIVERED', color: '#16A34A', bg: '#F0FDF4' },
  ];

  fsmSteps.forEach((st, idx) => {
    const x = 55 + idx * 148;
    doc.roundedRect(x, 156, 115, 30, 8).fillAndStroke(st.bg, st.color);
    doc.font('Helvetica-Bold').fontSize(9.5).fillColor(st.color).text(st.name, x, 166, { width: 115, align: 'center' });

    if (idx < fsmSteps.length - 1) {
      doc.font('Helvetica-Bold').fontSize(14).fillColor(COLORS.slateMed).text('➔', x + 120, 163);
    }
  });

  // Purge Branch
  doc.roundedRect(55, 196, 730, 24, 6).fillAndStroke(COLORS.redLight, COLORS.redBorder);
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.red)
    .text('🛡️ Deterministic Safety Intercept: If Di ≥ 1.0 at [POSTED], [MATCHED], or [CLAIMED] ➔ EXPIRED_AUTOMATED_PURGE (Auto-Delisted)', 55, 203, { width: 730, align: 'center' });

  // Left: Automated Safety Intercept Rule
  doc.roundedRect(40, 240, 370, 195, 10).fillAndStroke(COLORS.white, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.red).text('⛔ The Safety Auto-Purge Mechanism', 55, 252);
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.slateDark).text(
    `Zero-Tolerance Food Safety Policy:\n\n` +
    `• A continuous reactive effect monitors ambient temperature and time offsets.\n` +
    `• The moment Di reaches or exceeds 1.0, the batch is instantly delisted from all public feeds.\n` +
    `• A high-priority system toast notifies operators: "⛔ Auto-purged (Di ≥ 1.0)".\n` +
    `• If the expired post was inside a multi-stop batched driver job, the console marks that stop "Expired - skip" and allows the driver to proceed with remaining wholesome stops.\n` +
    `• Posts already IN_TRANSIT are safeguarded for courier dropoff evaluation.`,
    55, 270, { width: 340, lineGap: 2.2 }
  );

  // Right: Dual OTP Protocol
  doc.roundedRect(430, 240, 372, 195, 10).fillAndStroke(COLORS.white, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.primaryDark).text('🔐 Dual OTP Cryptographic Handshake', 445, 252);
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.slateDark).text(
    `Non-Repudiation Through Two Separate Handshakes:\n\n` +
    `1. Pickup OTP Handshake (Donor ↔ Driver):\n` +
    `   • Generated on donor's passcard (e.g. 3149, 4821).\n` +
    `   • Driver enters OTP into mobile keypad upon physical custody transfer.\n` +
    `   • Incorrect code triggers a tactile shake and blocks transit state.\n\n` +
    `2. Dropoff OTP Handshake (Driver ↔ NGO Manager):\n` +
    `   • Generated exclusively inside NGO's live tracking view (e.g. 7305, 2468).\n` +
    `   • Driver cannot mark delivery complete without NGO manager providing this OTP.\n` +
    `   • Protects both donor and driver against false spoilage or theft claims.`,
    445, 270, { width: 340, lineGap: 2.2 }
  );

  drawSpeakerNotes(
    450,
    "Safety is non-negotiable in food rescue. We enforce this through a deterministic Finite State Machine. If any food post exceeds a Decay Index of 1.0, our reactive safety intercept automatically purges it from the recipient feed with a warning toast. Furthermore, to prevent theft or unverified dropoffs, we introduced a Dual OTP handshake: the driver needs the donor's Passcard OTP to start transit, and the shelter manager's Dropoff OTP to complete delivery. Now Member 3 will show how this looks in the Recipient and Driver applications.",
    "2 mins",
    "Hand off to Member 3: 'Now Member 3 will walk through the Recipient Portal, our mobile-first Driver Fleet experience, and the 3-point inspection protocol.'"
  );
}

// ==========================================
// SLIDE 7 (Member 3)
// ==========================================
function renderSlide7() {
  drawSlideHeader(
    7, 12,
    'Recipient Portal: Capacity Matching & Instant Batch Lock',
    'Empowering NGO managers: Live headcount filtering, compatibility checks, and real-time transit telemetry.',
    3
  );

  // Left Column: Headcount Filter & Compatibility
  doc.roundedRect(40, 125, 370, 310, 10).fillAndStroke(COLORS.white, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.blue).text('🏠 Recipient NGO Operational Dashboard', 55, 140);
  doc.font('Helvetica').fontSize(9).fillColor(COLORS.slateDark).text(
    `1. Dynamic Capacity Headcount Filter:\n` +
    `   • NGO managers adjust their daily headcount (e.g. 50 children at Asha Kiran Orphanage) via an intuitive [− 50 +] stepper.\n` +
    `   • Headcount changes trigger live re-sorting of the Max-Heap priority queue.\n\n` +
    `2. Compatibility Toggle:\n` +
    `   • Default filter: "Only compatible listings" (meals ≥ 50% of headcount).\n` +
    `   • Prevents micro-batches from flooding large shelters while directing appropriate portions to smaller community kitchens.\n\n` +
    `3. Transparent Coverage Metrics:\n` +
    `   • Every listing card displays headcount coverage: "Covers 90% of headcount" or "✓ Fully covers your headcount (45/50)".\n` +
    `   • Clear urgency badges (Fresh, Urgent, Critical) give immediate sensory intuition.`,
    55, 162, { width: 340, lineGap: 3 }
  );

  // Right Column: Batch Lock & Tracking
  doc.roundedRect(430, 125, 372, 310, 10).fillAndStroke(COLORS.white, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.ink).text('🔒 1-Tap Claim & Real-Time Stepper Tracking', 445, 140);
  doc.font('Helvetica').fontSize(9).fillColor(COLORS.slateDark).text(
    `4. Instant Exclusive Batch Locking:\n` +
    `   • Clicking "Claim & Lock" opens a confirmation modal detailing donor name, meals, and cold-chain guidelines.\n` +
    `   • Confirming locks the batch exclusively for that NGO, preventing double-claims, and moves it to the Driver Available queue.\n\n` +
    `5. 4-Stage Horizontal Status Stepper:\n` +
    `   • Matched/Claimed ➔ Driver Assigned ➔ In Transit ➔ Delivered ✓.\n` +
    `   • Active stages pulse dynamically; completed stages turn green with checkmarks.\n\n` +
    `6. Protected Dropoff OTP Display:\n` +
    `   • The 4-digit Dropoff OTP is shown clearly in the tracking portal.\n` +
    `   • Includes direct tel: link to the assigned driver (Ravi Kumar) and Google Maps navigation deep links.`,
    445, 162, { width: 342, lineGap: 3 }
  );

  drawSpeakerNotes(
    450,
    "Hello everyone. When an NGO manager logs into MealBridge, they don't see cluttered lists—they see batches prioritized specifically for their facility. A shelter feeding 50 children can set their headcount with one tap, and our compatibility filter hides batches that are too small to feed their group. When they click 'Claim & Lock', the food is instantly locked and dispatched. In their tracking view, they see the 4-stage stepper and their secret Dropoff OTP.",
    "2 mins",
    "Point out the headcount stepper and explain how portion matching prevents food waste at shelters."
  );
}

// ==========================================
// SLIDE 8 (Member 3)
// ==========================================
function renderSlide8() {
  drawSlideHeader(
    8, 12,
    'Driver Fleet Logistics: Batched Routes & Safety Inspection',
    'Mobile-first courier execution: Maximizing delivery density with multi-stop batching and mandatory 3-point digital inspections.',
    3
  );

  // Left Column: Batched Routing & Micro-Payouts
  doc.roundedRect(40, 125, 370, 310, 10).fillAndStroke(COLORS.white, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.amber).text('🚚 Route Optimization & Fair Micro-Payouts', 55, 140);
  doc.font('Helvetica').fontSize(9).fillColor(COLORS.slateDark).text(
    `1. Mobile-First Ergonomic Frame:\n` +
    `   • Rendered inside a centered max-w-md mobile frame for realistic on-bike smartphone usage.\n\n` +
    `2. Multi-Stop Route Timeline (e.g. Job j1):\n` +
    `   • Pick up: Sri Ganesh Sweets (4 kg Dry Sweets)\n` +
    `   • Pick up: Bake Haven (5 kg Bakery Rolls)\n` +
    `   • 🏁 Deliver: Hope Night Shelter (Total 49 meals)\n` +
    `   • Aggregating multiple donors into one dropoff reduces transit costs by up to 60%.\n\n` +
    `3. Predictable Driver Economics:\n` +
    `   • Transparent payout calculated at ₹12/km (e.g. 9.4 km route = ₹113 payout).\n` +
    `   • Header displays today's accumulated earnings (₹420) and rating (⭐ 4.8).`,
    55, 162, { width: 340, lineGap: 3 }
  );

  // Right Column: 3-Point Safety Inspection Checklist
  doc.roundedRect(430, 125, 372, 310, 10).fillAndStroke(COLORS.white, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.primaryDark).text('📋 Mandatory 3-Point Safety Inspection Modal', 445, 140);
  doc.font('Helvetica').fontSize(9).fillColor(COLORS.slateDark).text(
    `Before accepting custody, the driver MUST physically inspect and tick all 3 criteria:\n\n` +
    `☑ 1. Packaging Integrity:\n` +
    `   "Food is enclosed in a sealed, tamper-evident MealBridge box or certified container."\n\n` +
    `☑ 2. Organoleptic Sensory Check:\n` +
    `   "Food looks fresh and wholesome—no off-odour, gas swelling, or visible discolouration."\n\n` +
    `☑ 3. Thermal & Freshness Compliance:\n` +
    `   • If cold-chain (milk sweets): "Temperature tag confirms compliance (4°C–10°C)."\n` +
    `   • Otherwise: "Digital freshness meter shows below 100% safe window."\n\n` +
    `• Enforcement: "Start Job" button remains strictly disabled until all three checkboxes are validated.`,
    445, 162, { width: 342, lineGap: 3 }
  );

  drawSpeakerNotes(
    450,
    "Now let's examine the driver experience. Delivery volunteers and gig couriers operate on two-wheelers, so we built the driver console mobile-first. In job j1, notice how our routing engine batches two nearby donors—Sri Ganesh Sweets and Bake Haven—into a single delivery run to Hope Night Shelter. The driver earns ₹12 per kilometer. But crucially, before accepting, the driver must complete a 3-point digital safety inspection verifying tamper-evident seals and temperature compliance.",
    "2 mins",
    "Highlight the batched route timeline (two pickups, one dropoff) as an example of logistics optimization."
  );
}

// ==========================================
// SLIDE 9 (Member 3)
// ==========================================
function renderSlide9() {
  drawSlideHeader(
    9, 12,
    'Driver Execution: Simulated Viewfinder & Tactile OTP Pad',
    'Simulating the physical-to-digital bridge: Camera viewfinder scanning and tactile numeric keypad verification.',
    3
  );

  // Left Column: Camera Viewfinder Simulation
  doc.roundedRect(40, 125, 370, 310, 10).fillAndStroke(COLORS.nightCard, '#1E293B');
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.neonCyan).text('📷 Simulated QR Camera Viewfinder', 55, 140);
  doc.font('Helvetica').fontSize(9).fillColor('#94A3B8').text(
    `1. High-Fidelity Camera Simulation:\n` +
    `   • Dark rounded viewport with illuminated cyan corner brackets.\n` +
    `   • Animated scanning line (animate-scan-line) simulates optical sensor beam.\n` +
    `   • Designed per spec: zero remote camera dependencies to guarantee offline demo reliability.\n\n` +
    `2. "Simulate Scan" Action:\n` +
    `   • One-click simulation triggers an optical decode sequence (1 second timer).\n` +
    `   • Success state renders a green verified badge: "✓ QR Matched: [Food Title]" and seamlessly reveals the OTP entry pad.\n\n` +
    `3. Manual Fallback:\n` +
    `   • A clean link allows direct entry of the 4-digit code if the QR code is damaged or unreadable.`,
    55, 162, { width: 340, lineGap: 3 }
  );

  // Right Column: Tactile OTP Keypad
  doc.roundedRect(430, 125, 372, 310, 10).fillAndStroke(COLORS.white, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.ink).text('🔢 Tactile 3x4 OTP Keypad & Error Handling', 445, 140);
  doc.font('Helvetica').fontSize(9).fillColor(COLORS.slateDark).text(
    `4. Custom Interactive Keypad:\n` +
    `   • 4 high-contrast digit boxes showing real-time entered characters.\n` +
    `   • Full numeric keypad (1–9, ⌫ backspace, 0, ✓ confirm).\n\n` +
    `5. Error State & Vibration Simulation:\n` +
    `   • If the driver enters an incorrect OTP, the digit boxes turn red and trigger a CSS shake animation (animate-shake).\n` +
    `   • Clear error message: "Incorrect OTP. Ask partner to check passcard."\n` +
    `   • Automatically resets digits after 700 ms for seamless re-entry.\n\n` +
    `6. Completion State:\n` +
    `   • Entering the correct code instantly advances the multi-stop route.\n` +
    `   • When dropoff OTP is entered, a celebratory scale-in checkmark confirms delivery and credits driver earnings!`,
    445, 162, { width: 342, lineGap: 3 }
  );

  drawSpeakerNotes(
    450,
    "During pickup, the driver points their phone at the donor's Passcard. We engineered a simulated viewfinder with an animated laser scan line. Clicking 'Simulate Scan' decodes the QR code and opens our custom numeric OTP keypad. If the driver inputs the wrong code, the UI shakes and turns red. When the correct code is entered, the stop turns green. Once dropoff OTP 7305 is entered at the shelter, the driver sees the success celebration and payout credited. Now Member 4 will cover our Enterprise CSR and Admin telemetry.",
    "2 mins",
    "Hand off to Member 4: 'Now Member 4 will present our corporate CSR impact portal, the admin telemetry room, and lead our live demonstration.'"
  );
}

// ==========================================
// SLIDE 10 (Member 4)
// ==========================================
function renderSlide10() {
  drawSlideHeader(
    10, 12,
    'Enterprise CSR: ESG Metrics, CO2e Avoided & 80G Receipts',
    'Closing the business loop: Turning food rescue into audited corporate sustainability reports and statutory tax exemptions.',
    4
  );

  // Left Column: CSR ESG Metrics & Charts
  doc.roundedRect(40, 125, 370, 310, 10).fillAndStroke(COLORS.white, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.primaryDark).text('📊 Corporate Sustainability (ESG) Reporting', 55, 140);
  doc.font('Helvetica').fontSize(9).fillColor(COLORS.slateDark).text(
    `1. Audited Q2 FY 2026-27 Impact Metrics (TechNova Solutions):\n` +
    `   • 🍽️ 12,840 Meals Delivered to verified charities.\n` +
    `   • 📦 4,280 kg Food Rescued from landfill degradation.\n` +
    `   • 🌍 10,700 kg CO₂e Emissions Prevented.\n` +
    `   • 🤝 168 Total Verified Donation Handshakes.\n\n` +
    `2. Interactive Recharts Data Visualizations:\n` +
    `   • Monthly Meals Bar Chart: Tracks steady redistribution scaling from April (1,650) to September (2,320).\n` +
    `   • Monthly CO₂e Line Chart: Illustrates direct environmental diversion under GHG Protocol Scope 3.\n\n` +
    `3. Downloadable Corporate Audit Report:\n` +
    `   • Single-click mock PDF download for annual sustainability filings.`,
    55, 162, { width: 340, lineGap: 3 }
  );

  // Right Column: Section 80G Tax Exemption Receipts
  doc.roundedRect(430, 125, 372, 310, 10).fillAndStroke(COLORS.white, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.ink).text('📜 Section 80G Tax Certificates & CO2e Formula', 445, 140);
  doc.font('Helvetica').fontSize(9).fillColor(COLORS.slateDark).text(
    `4. Statutory Section 80G Tax Exemption Certificates:\n` +
    `   • Commercial donors receive formal tax deduction vouchers for every funded batch.\n` +
    `   • Audit Table includes Receipt No (80G-2026-0912), Date, Amount Funded (₹1,50,000), and Meals Rescued (2,320).\n` +
    `   • "Download 80G" button provides immutable proof for tax assessment.\n\n` +
    `5. The GHG Landfill Avoidance Formula:\n` +
    `   • CO₂e Saved = Food Rescued (kg) × 2.5 kg CO₂e.\n` +
    `   • Scientific Basis: When organic food rots in anaerobic municipal dumps, it releases methane (CH₄), which is 28x more potent than CO₂ over a 100-year timescale.\n` +
    `   • Diverting 4,280 kg of food eliminates 10.7 tonnes of CO₂ equivalent!`,
    445, 162, { width: 342, lineGap: 3 }
  );

  drawSpeakerNotes(
    450,
    "Hello judges, I am Member 4. Social good platforms fail if they rely solely on charity. MealBridge creates a self-sustaining economic model. Commercial donors and corporate sponsors receive two massive incentives: first, audited ESG impact metrics rendered with Recharts, proving thousands of meals served and tons of CO2e prevented; and second, official Section 80G tax exemption certificates. By using the EPA multiplier of 2.5 kg CO2e per kg of food diverted, we give companies verified carbon offset credits.",
    "2 mins",
    "Emphasize the business model and 80G tax certificates—this shows the project is practical and economically viable."
  );
}

// ==========================================
// SLIDE 11 (Member 4)
// ==========================================
function renderSlide11() {
  drawSlideHeader(
    11, 12,
    'Admin Mission Control: SVG Spatial Telemetry & FHRI Board',
    'Dark-mode operational telemetry: Real-time network mapping, transit vectors, and donor hygiene audit matrices.',
    4
  );

  // Left Column: SVG Spatial Map
  doc.roundedRect(40, 125, 370, 310, 10).fillAndStroke(COLORS.nightBg, '#1E293B');
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.neonCyan).text('🗺️ Spatial Topology Map & Transit Vectors', 55, 140);
  doc.font('Helvetica').fontSize(9).fillColor('#94A3B8').text(
    `1. Scalable SVG Spatial Telemetry (viewBox="0 0 100 100"):\n` +
    `   • Dotted coordinate grid overlay representing city sectors.\n` +
    `   • Neon-Green Pulsing Nodes: Active commercial donors (Hotel Grand Orchid, Sri Ganesh Sweets, Bake Haven, Royal Banquet).\n` +
    `   • CSS animate-pulse-ring visually highlights donors with ready surplus.\n` +
    `   • Neon-Cyan Diamond Nodes: Verified recipient NGOs; pending shelters rendered hollow.\n\n` +
    `2. Real-Time Transit Vector Dashed Lines:\n` +
    `   • For in-transit batches (e.g. Job j2 from d1 to n2), an animated dashed vector line connects the donor to the shelter.\n` +
    `   • SVG animated packet dot travels smoothly along the trajectory in real time.`,
    55, 162, { width: 340, lineGap: 3 }
  );

  // Right Column: FHRI Board & Metrics
  doc.roundedRect(430, 125, 372, 310, 10).fillAndStroke(COLORS.nightCard, '#1E293B');
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.white).text('🛡️ Donor FHRI Audit Board & Telemetry Feed', 445, 140);
  doc.font('Helvetica').fontSize(9).fillColor('#94A3B8').text(
    `3. Food Hygiene & Reliability Index (FHRI):\n` +
    `   FHRI = 0.50·OnTime + 0.30·Packaging − 0.20·Spoils\n` +
    `   • Donors scoring < 0.70 are flagged red: "⚠ Physical audit required • Cooked > 10 kg restricted".\n` +
    `   • Bake Haven scores 0.69 ➔ flagged instantly on the board!\n\n` +
    `4. Live Surplus Telemetry Counters:\n` +
    `   • Surplus available now: 46 kg • In transit: 1 job (20 kg)\n` +
    `   • Delivered today: 18 kg • Auto-purged: 1 batch • Flagged donors: 1\n\n` +
    `5. Live Dispatch Stream:\n` +
    `   • Automatically prepends live system events every 6 seconds.`,
    445, 162, { width: 342, lineGap: 3 }
  );

  drawSpeakerNotes(
    450,
    "For city administrators and platform dispatchers, we engineered a dark-mode Mission Control console. The SVG map renders the live spatial network. Active donors pulse with neon-green CSS rings, and in-transit deliveries show animated dashed vector lines with traveling packets. At the bottom, our FHRI reliability board monitors hygiene. Notice that Bake Haven is flagged red because their FHRI is 0.69, which automatically restricts them from posting large cooked batches. Everything is live and reactive.",
    "2 mins",
    "Point out the animated transit vector and the FHRI audit flag on Bake Haven (0.69) as evidence of safety enforcement."
  );
}

// ==========================================
// SLIDE 12 (Member 4)
// ==========================================
function renderSlide12() {
  drawSlideHeader(
    12, 12,
    'Live Demo Guide, Team Summary & Technical Roadmap',
    'Step-by-step presentation demonstration script, technical achievements, and future engineering milestones.',
    4
  );

  // Left Column: Step-by-Step Demo Script
  doc.roundedRect(40, 125, 370, 310, 10).fillAndStroke(COLORS.white, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.primaryDark).text('🎬 Presentation Day Live Demo Script (3 Mins)', 55, 140);
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.slateDark).text(
    `1. Start at Landing Page (/):\n` +
    `   Show the 4-step protocol and 5 interactive role cards.\n\n` +
    `2. Donor Portal (/donor):\n` +
    `   Tap "Cooked Meals" preset ➔ Form opens prefilled. Adjust weight to 15 kg (≈ 45 meals). Check the digital waiver and submit ➔ Instant Passcard with QR and Pickup OTP!\n\n` +
    `3. Open Demo Control Panel (Bottom-Left Pill):\n` +
    `   Increase ambient temperature from 32°C to 38°C ➔ Watch the freshness ring decay advance live!\n\n` +
    `4. Recipient Feed (/recipient):\n` +
    `   Show Max-Heap sorting. Adjust headcount stepper to 80 ➔ Watch priority recalculate. Click "Claim & Lock" ➔ Batch moves to My Claims.\n\n` +
    `5. Driver App (/driver) & Delivery:\n` +
    `   Open Job ➔ Tick 3-point inspection ➔ Simulate QR scan ➔ Enter Pickup OTP (4821) ➔ In-transit ➔ Enter Dropoff OTP (7305) ➔ Success screen!\n\n` +
    `6. Fast-Forward Time (+3h):\n` +
    `   Show p2 auto-purging from the feed (safety intercept in action!).`,
    55, 160, { width: 340, lineGap: 2.2 }
  );

  // Right Column: Summary & Future Roadmap
  doc.roundedRect(430, 125, 372, 310, 10).fillAndStroke(COLORS.white, COLORS.slateBorder);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.ink).text('🚀 Summary of Achievements & Phase 2 Roadmap', 445, 140);
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.slateDark).text(
    `Core ISE Technical Deliverables Met:\n` +
    `• Zero backend dependency — 100% deterministic client-side execution in React Context & Reducer.\n` +
    `• Verified against all Section 6.5 test vectors.\n` +
    `• Full responsiveness from 375px mobile viewport to 4K desktop.\n` +
    `• Committed to GitHub: github.com/divyanshbuilds30/Meal_Bridge\n\n` +
    `Phase 2 Engineering Milestones:\n` +
    `• OpenWeather API Integration: Real-time microclimate ambient temperature feeds.\n` +
    `• HTML5 WebRTC Camera Barcode/QR Scanner API.\n` +
    `• Live OSRM / Mapbox Turn-by-Turn GPS routing for couriers.\n` +
    `• Hyperledger Sawtooth immutable blockchain ledger for 80G tax audit compliance.\n\n` +
    `Thank you! We are now open for questions from the panel.`,
    445, 160, { width: 342, lineGap: 2.5 }
  );

  drawSpeakerNotes(
    450,
    "To conclude our presentation, we will demonstrate the running system live at localhost:3000. In just three minutes, we will post a batch, see our Max-Heap match it in 3 seconds, accept the job as a driver through the 3-point inspection, complete the dual OTP handshake, and fast-forward time to trigger the safety auto-purge. MealBridge transforms food rescue from an ad-hoc charity scramble into a rigorous, deterministic logistics science. Thank you, and we welcome your questions.",
    "2 mins",
    "Open the browser window alongside your presentation to run the quick 3-minute interactive demo sequence."
  );
}

// Generate all slides
renderCoverSlide();

doc.addPage();
renderSlide1();

doc.addPage();
renderSlide2();

doc.addPage();
renderSlide3();

doc.addPage();
renderSlide4();

doc.addPage();
renderSlide5();

doc.addPage();
renderSlide6();

doc.addPage();
renderSlide7();

doc.addPage();
renderSlide8();

doc.addPage();
renderSlide9();

doc.addPage();
renderSlide10();

doc.addPage();
renderSlide11();

doc.addPage();
renderSlide12();

doc.end();

stream.on('finish', () => {
  console.log(`PDF successfully generated at: ${outputPath}`);
});
