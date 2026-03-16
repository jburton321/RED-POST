/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        brand: {
          red: '#d21920',
          'red-glow': '#ff3333',
          'red-depth': '#5a0000',
        },
      },
    },
  },
  plugins: [],
};
