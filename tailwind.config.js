/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        grey: 'rgb(37, 39, 46)',
        lightGrey: '#525767'
      },
      height: {
        tablet: '768px'
      }
    },
  },
  plugins: [],
}

