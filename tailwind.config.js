/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        grey: 'rgb(37, 39, 46)',
        lightGrey: '#525767'
      },
      height: {
        tablet: '768px'
      },
      spacing: {
        'cel': '500px',
      }
    },
  },
  plugins: [],
}

