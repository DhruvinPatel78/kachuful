/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        "red-400": "#ef5350",
        "red-900": "#b71c1c",
        'red': '#e74c3c',
      },
    },
  },
  plugins: [],
};
