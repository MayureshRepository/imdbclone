/** @type {import('tailwindcss').Config} */

// Theme-aware colors are backed by CSS variables (RGB channels) defined in
// src/styles.css, so `<html class="light">` flips the whole palette while
// opacity modifiers like `bg-white/10` keep working.
const themed = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: ["class", "html:not(.light)"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Plus Jakarta Sans"', '"Inter"', "sans-serif"],
      },
      colors: {
        // "white" is the foreground color: white in dark mode, near-black in light mode.
        white: themed("fg"),
        ink: {
          950: themed("ink-950"),
          900: themed("ink-900"),
          850: themed("ink-850"),
          800: themed("ink-800"),
          700: themed("ink-700"),
          600: themed("ink-600"),
        },
        zinc: {
          100: themed("zinc-100"),
          200: themed("zinc-200"),
          300: themed("zinc-300"),
          400: themed("zinc-400"),
          500: themed("zinc-500"),
          600: themed("zinc-600"),
        },
        brand: {
          300: themed("brand-300"),
          400: themed("brand-400"),
          500: "#f5c518",
          600: "#d9a90b",
        },
        accent: {
          400: themed("accent-400"),
          500: "#6d5efc",
          600: "#5847f5",
        },
        // Fixed colors for text on brand / colored surfaces (never flip).
        onbrand: "#07080c",
        snow: "#ffffff",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(245,197,24,.35), 0 10px 40px -10px rgba(245,197,24,.35)",
        "glow-accent": "0 0 0 1px rgba(109,94,252,.4), 0 12px 40px -12px rgba(109,94,252,.55)",
        card: "0 10px 30px -12px rgb(var(--c-shadow) / .7)",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(14px, -18px, 0) scale(1.06)" },
        },
        "heart-pop": {
          "0%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.35)" },
          "55%": { transform: "scale(.88)" },
          "75%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)" },
        },
        "ring-burst": {
          "0%": { boxShadow: "0 0 0 0 rgba(244, 63, 94, .55)" },
          "100%": { boxShadow: "0 0 0 14px rgba(244, 63, 94, 0)" },
        },
        bump: {
          "0%, 100%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.35)" },
        },
        "spin-in": {
          "0%": { opacity: "0", transform: "rotate(-120deg) scale(.5)" },
          "100%": { opacity: "1", transform: "rotate(0) scale(1)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".55" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
        "gradient-pan": "gradient-pan 8s ease infinite",
        "fade-up": "fade-up .6s cubic-bezier(.22,1,.36,1) both",
        float: "float 14s ease-in-out infinite",
        "float-slow": "float 20s ease-in-out infinite reverse",
        "heart-pop": "heart-pop .5s cubic-bezier(.22,1,.36,1)",
        "ring-burst": "ring-burst .6s ease-out",
        bump: "bump .45s cubic-bezier(.22,1,.36,1)",
        "spin-in": "spin-in .5s cubic-bezier(.22,1,.36,1)",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
