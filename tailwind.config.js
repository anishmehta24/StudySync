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
          DEFAULT: '#FF5A5F', // Coral Red
          light: '#FF8A80',   // Light Coral
          dark: '#E63946',    // Deep Coral
        },
        secondary: {
          DEFAULT: '#36C9C6', // Turquoise
          light: '#89E2DE',   // Light Turquoise
          dark: '#0F4C5C',    // Dark Teal
        },
        background: '#FFF9F4', // Off-White
        text: {
          DEFAULT: '#2A2D34', // Charcoal
          light: '#595E69',   // Grayish Blue
        },
      },
    },
  },
  plugins: [],
}

