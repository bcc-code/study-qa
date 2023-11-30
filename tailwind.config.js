/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        'background-4': '#0D131A',
        'separator': 'rgba(13, 19, 26, 0.1)',
        'label-1': '#0D131A'
      }
    },
    fontFamily: {
      sans: ['"Inter"', 'sans-serif']
    },

  },
  plugins: [],
}

