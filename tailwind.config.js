/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FCFBF8',
          100: '#F8F5EE',
          200: '#F2ECDF',
          300: '#E8DFC9',
          400: '#D9CBB0',
          500: '#C5B393',
        },
        sage: {
          50: '#F5F7F5',
          100: '#E6ECE7',
          200: '#CEDCD0',
          300: '#ADC4B1',
          400: '#87A98E',
          500: '#5B8764',
          600: '#476D4F',
          700: '#395740',
          800: '#2E4433',
          900: '#243528',
        },
        gold: {
          50: '#FCF9F1',
          100: '#F7F0D8',
          200: '#EFE0AE',
          300: '#E4CA7E',
          400: '#D5B051',
          500: '#BE9432',
          600: '#9B7424',
          700: '#79571D',
          800: '#5C4119',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(46, 68, 51, 0.05), 0 4px 6px -2px rgba(46, 68, 51, 0.02)',
        'card': '0 4px 20px -2px rgba(57, 87, 64, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'modal': '0 20px 40px -8px rgba(36, 53, 40, 0.16), 0 8px 16px -4px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
