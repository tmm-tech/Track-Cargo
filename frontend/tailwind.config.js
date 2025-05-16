/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#273272",
        accent: "#ffb600",
      },
    },
  },
  plugins: [],
}