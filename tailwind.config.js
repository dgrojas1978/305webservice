/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#030B1A",
          navy: "#071426",
          card: "#0A1628",
          blue: "#2563EB",
          accent: "#3B82F6",
          glow: "#60A5FA",
          cyan: "#06B6D4",
          emerald: "#059669",
          emeraldLight: "#10B981",
          light: "#F0F6FF",
          muted: "#94A3B8",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out both",
        "fade-in": "fadeIn 0.5s ease-out both",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-glow": "radial-gradient(ellipse at 50% 0%, rgba(37, 99, 235, 0.25) 0%, transparent 70%)",
        "card-shine": "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)",
      },
      boxShadow: {
        "glow-blue": "0 0 40px rgba(37, 99, 235, 0.3)",
        "glow-sm": "0 0 20px rgba(37, 99, 235, 0.15)",
        "card-dark": "0 4px 32px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 20px 60px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};
