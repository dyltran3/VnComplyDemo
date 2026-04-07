import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "inverse-surface": "#dae2fd",
        "on-tertiary-fixed": "#00201c",
        "background": "#0b1326",
        "secondary-container": "#3e495d",
        "surface": "#0b1326",
        "tertiary-container": "#001c18",
        "on-background": "#dae2fd",
        "primary-fixed": "#d8e2ff",
        "inverse-on-surface": "#283044",
        "on-tertiary-container": "#009182",
        "outline-variant": "#45464d",
        "outline": "#909097",
        "on-error-container": "#ffdad6",
        "surface-container": "#171f33",
        "surface-tint": "#adc6ff",
        "secondary-fixed-dim": "#bcc7de",
        "on-tertiary-fixed-variant": "#005047",
        "tertiary-fixed-dim": "#3cddc7",
        "surface-container-highest": "#2d3449",
        "tertiary-fixed": "#62fae3",
        "on-primary-fixed": "#001a42",
        "on-surface-variant": "#c6c6cd",
        "tertiary": "#3cddc7",
        "primary-fixed-dim": "#adc6ff",
        "error-container": "#93000a",
        "on-secondary-fixed-variant": "#3c475a",
        "surface-bright": "#31394d",
        "surface-container-low": "#131b2e",
        "surface-container-high": "#222a3d",
        "on-primary": "#002e6a",
        "surface-variant": "#2d3449",
        "secondary": "#bcc7de",
        "surface-dim": "#0b1326",
        "on-secondary": "#263143",
        "on-primary-container": "#357df1",
        "surface-container-lowest": "#060e20",
        "on-error": "#690005",
        "primary": "#adc6ff",
        "inverse-primary": "#005ac2",
        "secondary-fixed": "#d8e3fb",
        "on-surface": "#dae2fd",
        "primary-container": "#00163a",
        "error": "#ffb4ab",
        "on-secondary-container": "#aeb9d0",
        "on-secondary-fixed": "#111c2d",
        "on-primary-fixed-variant": "#004395",
        "on-tertiary": "#003731"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      fontFamily: {
        "headline": ["var(--font-manrope)", "Manrope", "sans-serif"],
        "body": ["var(--font-inter)", "Inter", "sans-serif"],
        "label": ["var(--font-inter)", "Inter", "sans-serif"]
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries")
  ],
};
export default config;
