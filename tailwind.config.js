/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        noche: '#0E1218',
        'noche-2': '#171D27',
        adobe: '#D9C6AC',
        'adobe-sombra': '#B79C7B',
        cal: '#F3EEE6',
        niebla: '#8C93A3',
        pacifico: '#2E6BFF',
        totora: '#C8D45A',
        peligro: '#FFD400',
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', '"Arial Narrow"', 'sans-serif'],
        body: ['"Hanken Grotesk"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
