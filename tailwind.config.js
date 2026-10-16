/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "var(--color-bg)",
        surface: {
          dark: "var(--color-surface-dark)",
          card: "var(--color-card)",
          cardHover: "var(--color-card-hover)",
          border: "var(--color-border)",
          borderHover: "var(--color-border-hover)",
        },
        cyber: {
          cyan: "var(--color-accent)",
          cyanDim: "var(--color-accent-dim)",
          amber: "#ffb703",
          green: "var(--color-secondary)",
          crimson: "#ef4444",
          purple: "#a855f7",
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        }
      },
      animation: {
        scanline: 'scanline 8s linear infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
