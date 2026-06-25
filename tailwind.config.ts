import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        shell: {
          DEFAULT: "var(--color-shell)",
          dark: "var(--color-shell-dark)",
        },
        stone: {
          DEFAULT: "var(--color-stone)",
          light: "var(--color-stone-light)",
          dark: "var(--color-stone-dark)",
        },
        sky: {
          DEFAULT: "var(--color-sky)",
          light: "var(--color-sky-light)",
          dark: "var(--color-sky-dark)",
        },
        honeydew: {
          DEFAULT: "var(--color-honeydew)",
          light: "var(--color-honeydew-light)",
          dark: "var(--color-honeydew-dark)",
        },
        viridian: {
          DEFAULT: "var(--color-viridian)",
          light: "var(--color-viridian-light)",
          dark: "var(--color-viridian-dark)",
          hover: "var(--color-viridian-light)",
        },
      },
      fontFamily: {
        serif: ["var(--font-averia-serif)", "serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(52, 73, 69, 0.04), 0 2px 8px -1px rgba(52, 73, 69, 0.02)",
        calm: "0 10px 30px -5px rgba(52, 73, 69, 0.06), 0 4px 12px -2px rgba(52, 73, 69, 0.03)",
        glass: "0 8px 32px 0 rgba(52, 73, 69, 0.05)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
