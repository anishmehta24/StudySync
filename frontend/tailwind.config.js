/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",


"./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000000', // Black
          light: '#4F4F4F',   // Dark Gray for hover effects
          dark: '#1A1A1A',    // Almost Black for emphasis
        },
        secondary: {
          DEFAULT: '#FFFFFF', // White
          light: '#E0E0E0',   // Light Gray for borders
          dark: '#BDBDBD',    // Gray for secondary text
        },
        background: '#FFFFFF', // Pure White for background
        text: {
          DEFAULT: '#000000', // Black for primary text
          light: '#4F4F4F',   // Dark Gray for secondary text
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in',
        bounceIn: 'bounceIn 1.5s ease-in-out',
        slideIn: 'slideIn 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        bounceIn: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-30px)' },
          '60%': { transform: 'translateY(-15px)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}

