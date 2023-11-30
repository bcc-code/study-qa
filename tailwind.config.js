/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        'background-1': 'var(--background-1)',
        'background-2': 'var(--background-2)',
        'background-4': 'var(--background-4)',
        'label-1': 'var(--label-1)',
        'label-2': 'var(--label-2)',
        'label-3': 'var(--label-3)',
        'on-color-1': 'var(--on-color-1)',
        'separator': 'var(--separator)',
      }
    },
    fontFamily: {
      sans: ['"Inter"', 'sans-serif']
    },

  },
  plugins: [],
}

