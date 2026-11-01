/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#101114',
        'secondary-bg': '#181A20',
        'card-bg': '#1B1E26',
        'elevated-bg': '#222632',
        accent: {
          DEFAULT: '#E8B44F',
          hover: '#F2C160',
          muted: 'rgba(232, 180, 79, 0.15)',
        },
        'text-primary': '#F5F5F5',
        'text-secondary': '#969BA7',
        'text-muted': '#5F6575',
        success: {
          DEFAULT: '#42C98A',
          hover: '#4CE09B',
          muted: 'rgba(66, 201, 138, 0.15)',
        },
        error: {
          DEFAULT: '#EF6464',
          hover: '#F47878',
          muted: 'rgba(239, 100, 100, 0.15)',
        },
        border: {
          DEFAULT: '#272B37',
          light: '#353A4B',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'Fira Code', 'Courier New', 'monospace'],
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(232, 180, 79, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(232, 180, 79, 0.6)' },
        },
      },
      animation: {
        blink: 'blink 1s ease-in-out infinite',
        glow: 'pulseGlow 2s infinite ease-in-out',
      },
    },
  },
  plugins: [],
};
