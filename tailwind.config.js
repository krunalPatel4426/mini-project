/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        romantic: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        velvet: {
          dark: '#000000', // Redefined velvet dark as absolute black
          deep: '#0a0a0a', // Deep dark grey/black
          mid: '#121212',  // Card background grey/black
        },
        gold: {
          light: '#fef08a',
          accent: '#eef227', // Lemon/Limbu yellow accent
          glow: '#facc15',
          dark: '#ca8a04',
        },
        akshu: {
          black: '#000000',
          white: '#ffffff',
          pink: '#be185d',       // Dark pink
          pinkGlow: '#db2777',   // Glowing pink
          pinkDeep: '#9d174d',   // Deepest pink
          yellow: '#eef227',     // Limbu yellow / Lemon yellow
          yellowGlow: '#fef08a', // Light lemon yellow
          orange: '#ff6b00',     // Vibrant orange
          orangeDark: '#ea580c', // Dark orange
        }
      },
      fontFamily: {
        title: ['"Cinzel Decorative"', 'serif'],
        cursive: ['"Great Vibes"', 'cursive'],
        sans: ['Inter', 'sans-serif'],
        gujarati: ['"Noto Sans Gujarati"', 'sans-serif'],
      },
      animation: {
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'wobble': 'wobble 0.5s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'envelope-flap': 'envelope-flap 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'spin-slow': 'spin-slow 15s linear infinite',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(3deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(219, 39, 119, 0.4)' },
          '50%': { boxShadow: '0 0 25px rgba(238, 242, 39, 0.8)' },
        },
        wobble: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        'envelope-flap': {
          '0%': { transform: 'rotateX(0deg)', zIndex: 10 },
          '100%': { transform: 'rotateX(180deg)', zIndex: 1 },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
