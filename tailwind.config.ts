import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'warroom-bg': '#080a0d',
        'warroom-surface': '#0d1117',
        'warroom-border': '#1a2332',
        'warroom-red': '#e74c3c',
        'warroom-amber': '#f39c12',
        'warroom-blue': '#2980b9',
        'warroom-green': '#27ae60',
        'warroom-text': '#cdd6e0',
        'warroom-dim': '#4a5568',
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', 'monospace'],
        display: ['"Bebas Neue"', 'cursive'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'ping-slow': 'ping 2s ease-out infinite',
        'scroll-ticker': 'scroll-ticker 60s linear infinite',
      },
      keyframes: {
        'scroll-ticker': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
