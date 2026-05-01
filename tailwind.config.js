/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Playfair Display', 'serif'],
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
