/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17212b',
        guard: '#6d28d9',
        amber: '#d97706',
        paper: '#f7f3ea',
      },
    },
  },
  plugins: [],
};
