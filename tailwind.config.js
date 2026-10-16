/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0a0b0e",
        surface: {
          dark: "#050508",
          card: "#11131a",
          cardHover: "#161922",
          border: "#1f2430",
          borderHover: "#2d3545",
        },
        cyber: {
          cyan: "#00f0ff",
          cyanDim: "#00f0ff22",
          amber: "#ffb703",
          green: "#10b981",
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
