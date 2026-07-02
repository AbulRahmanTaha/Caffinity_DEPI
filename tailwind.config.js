/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-white': '#FEFEFE',
        'brand-gray-light': '#F4F4F4',
        'brand-gray': '#D9D9D9',
        'brand-gray-dark': '#A0A0A0',
        'brand-black': '#282828',
        'brand-yellow': '#C3B212',
        'brand-red': '#BC575F',
        'brand-green': '#1FEA59'
      },
      fontFamily: {
        'heading': ['"Prosto One"', 'sans-serif'],
        'body': ['"Montserrat"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
