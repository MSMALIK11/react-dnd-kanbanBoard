/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": '#0D1117',
        "secondary": '#161C22',
        "bgSecondary": 'white',
        "bgColumnSecondary": '#F1F2F3',
        "textPrimary": 'white',
        "textSecondary": "#000"

      }
    },
  },
  plugins: [],
  darkMode: 'class'
}

