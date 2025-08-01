/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        "red-400": "#ef5350",
        'red': '#e74c3c',
      },
    },
  },
  plugins: [],
};
