/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Light, premium system: white canvas, charcoal text, technology blue accent
        ink: {
          DEFAULT: "#0F172A", // headings / charcoal
          soft: "#334155",    // strong body text
          muted: "#475569",   // body text (AA on white)
          faint: "#64748B",   // captions (AA on white)
        },
        brand: {
          blue: "#2563EB",       // primary accent
          blueDark: "#1D4ED8",   // hover
          blueSoft: "#EFF6FF",   // tinted surfaces
          navy: "#0B1D3A",       // secondary / dark sections
          navyDeep: "#081527",   // footer
        },
        positive: {
          DEFAULT: "#15803D",    // green, positive states only (AA on white)
          soft: "#F0FDF4",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F8FAFC",
          line: "#E2E8F0",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      maxWidth: {
        content: "72rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.05)",
        "card-hover": "0 2px 4px rgba(15, 23, 42, 0.05), 0 12px 32px rgba(15, 23, 42, 0.09)",
        cta: "0 8px 24px rgba(37, 99, 235, 0.22)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
