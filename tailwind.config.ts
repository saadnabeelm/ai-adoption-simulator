/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
      },
      colors: {
        bg: '#F7F5F0',
        surface: '#FFFFFF',
        surface2: '#F0EDE7',
        border: '#E2DDD6',
        muted: '#6B6760',
        accent: '#2D5BE3',
        'accent-soft': '#EEF2FF',
        explorer: { DEFAULT: '#2D5BE3', bg: '#EEF2FF' },
        operator: { DEFAULT: '#0F6E56', bg: '#E1F5EE' },
        overwhelmed: { DEFAULT: '#BA7517', bg: '#FAEEDA' },
        skeptic: { DEFAULT: '#993556', bg: '#FBEAF0' },
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'slide-in': 'slideIn 0.35s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
