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
    },
  },
  plugins: [],
}

