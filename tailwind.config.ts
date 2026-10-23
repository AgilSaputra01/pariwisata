import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        ink: '#0b171c',
        foam: '#f3efe6',
        mist: '#93a39e',
        lagoon: '#14b8a6',
        panel: 'rgba(15, 34, 43, 0.88)',
        line: 'rgba(243, 239, 230, 0.16)',
        emeraldIsland: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        sunsetWarm: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        outfit: ['var(--font-outfit)', 'sans-serif'],
        fraunces: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 25px -4px rgba(0, 0, 0, 0.06), 0 2px 10px -2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 20px 30px -10px rgba(2, 132, 199, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 25px -5px rgba(20, 184, 166, 0.35)',
        'lagoon-glow': '0 0 20px rgba(20, 184, 166, 0.4)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
export default config;
