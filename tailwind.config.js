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
