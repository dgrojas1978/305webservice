/** @type {import('tailwindcss').Config} */
/*
 * Sistema visual «Monumento 305».
 * Paleta obligatoria — sin degradados, sin sombras grandes, sin colores extra.
 */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#071426",
        blue: "#146cff",
        turquoise: "#20d7c5",
        paper: "#f7f9fc",
        body: "#526071",
        hairline: "#cdd5df",
        // texto sobre navy
        "on-navy": "rgba(247, 249, 252, 0.78)",
        "on-navy-faint": "rgba(247, 249, 252, 0.5)",
      },
      fontFamily: {
        sans: ["Inter", "Helvetica Neue", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["var(--display-xl)", { lineHeight: "0.9", fontWeight: "900" }],
        display: ["var(--display)", { lineHeight: "0.95", fontWeight: "900" }],
        h1: ["var(--h1)", { lineHeight: "1.02", fontWeight: "900" }],
        h2: ["var(--h2)", { lineHeight: "1.05", fontWeight: "800" }],
        h3: ["var(--h3)", { lineHeight: "1.2", fontWeight: "700" }],
        "body-lg": ["var(--body-lg)", { lineHeight: "1.65" }],
        micro: ["var(--micro)", { lineHeight: "1.4", fontWeight: "600", letterSpacing: "0.22em" }],
      },
      maxWidth: {
        site: "1440px",
      },
      spacing: {
        // Antes clamp(96px,12vw,190px): hasta ~380px de aire entre secciones.
        section: "clamp(56px, 7vw, 104px)",
        gutter: "clamp(24px, 5vw, 88px)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
