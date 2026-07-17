/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'hsl(119 99% 46%)',
        'primary-foreground': 'hsl(0 0% 4%)',
        'hero-bg': 'hsl(0 0% 8%)',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
