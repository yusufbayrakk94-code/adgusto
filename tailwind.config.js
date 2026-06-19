/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#94fa01',
        secondary: '#94fa01',
        accent: '#94fa01',
        dark: '#0b0b0b',
        gray: '#828282',
      },
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
