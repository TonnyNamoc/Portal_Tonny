/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        noche: 'rgb(var(--noche-rgb) / <alpha-value>)',
        'noche-2': 'rgb(var(--noche-2-rgb) / <alpha-value>)',
        adobe: 'rgb(var(--adobe-rgb) / <alpha-value>)',
        'adobe-sombra': 'rgb(var(--adobe-sombra-rgb) / <alpha-value>)',
        cal: 'rgb(var(--cal-rgb) / <alpha-value>)',
        niebla: 'rgb(var(--niebla-rgb) / <alpha-value>)',
        pacifico: 'rgb(var(--pacifico-rgb) / <alpha-value>)',
        totora: 'rgb(var(--totora-rgb) / <alpha-value>)',
        peligro: 'rgb(var(--peligro-rgb) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--f-display)'],
        body: ['var(--f-body)'],
        mono: ['var(--f-mono)'],
      },
    },
  },
  plugins: [],
}
