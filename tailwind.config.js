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
        background: '#F8F9FA',
        'secondary-bg': '#FFFFFF',
        'card-bg': '#FFFFFF',
        'elevated-bg': '#F1F3F6',
        accent: {
          DEFAULT: '#FF5E3A',
          hover: '#FF471D',
          muted: 'rgba(255, 94, 58, 0.12)',
          peach: '#FFF0EA',
          border: '#FFD7CC',
        },
        'text-primary': '#1E232E',
        'text-secondary': '#8A94A6',
        'text-muted': '#A4ADC0',
        success: {
          DEFAULT: '#27AE60',
          hover: '#219653',
          muted: 'rgba(39, 174, 96, 0.12)',
        },
        error: {
          DEFAULT: '#EB5757',
          hover: '#E03E3E',
          muted: 'rgba(235, 87, 87, 0.15)',
        },
        border: {
          DEFAULT: '#E8ECF2',
          light: '#F0F3F7',
          orange: '#FFD9CF',
        },
        keyboard: {
          bg: '#FFF6F2',
          key: '#FFFFFF',
          border: '#F6E4DC',
          active: '#FF7B59',
          shift: '#FFB8A5',
          text: '#7A645C',
        },
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Nunito',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'system-ui',
          'sans-serif',
        ],
        mono: ['Fira Code', 'JetBrains Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        pill: '0 2px 8px -2px rgba(0, 0, 0, 0.05)',
        float: '0 8px 30px rgba(0, 0, 0, 0.06)',
        coral: '0 4px 14px rgba(255, 94, 58, 0.35)',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        blink: 'blink 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
