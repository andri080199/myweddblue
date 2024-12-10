import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        textprimary: "var(--textprimary)",
        darkprimary: "var(--darkprimary)",
        primarylight: "var(--primarylight)",
        gold: "var(--gold)",
      },
      fontFamily: {
        merienda: ["var(--font-merienda)", "cursive"],
        fajardose: ["var(--font-fajardose)", "cursive"],
        lavishly: ["var(--font-lavishly)", "cursive"],
        fleur: ["var(--font-fleur)", "cursive"],
        poppins: ["var(--font-poppins)", "sans-serif"],
        sans: ["var(--font-geist-sans)", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        allura: ["var(--font-allura)", "cursive"],
        
      },
      keyframes: {
        bounceDown: {
          "0%, 100%": { transform: "translateY(-20px)" },
          "50%": { transform: "translateY(20px)" },
        },
        bounceUp: {
          "0%, 100%": { transform: "translateY(20px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        tiltLeft: {
          "0%, 100%": { transform: "rotate(0deg) translateY(0)" },
          "50%": { transform: "rotate(-5deg) translateY(-10px)" },
        },
        tiltRight: {
          "0%, 100%": { transform: "rotate(0deg) translateY(0)" },
          "50%": { transform: "rotate(5deg) translateY(-10px)" },
        },
      },
      animation: {
        bounceUpDown: "bounceUpDown 5s ease-in-out infinite",
        bounceDown: "bounceDown 7s ease-in-out infinite",
        bounceUp: "bounceUp 7s ease-in-out infinite",
        tiltLeft: "tiltLeft 5s ease-in-out infinite",
        tiltRight: "tiltRight 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
