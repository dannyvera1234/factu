/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#182E54', // Asegúrate de que no haya opacidad en el color
        secondary: '#DF3D24',
        tertiary: '#F2F8FF',
      },
      fontFamily: {
        poppins: ['sans-serif'],
      },
    },
  },
  // plugins: [require('flyonui'), require('flyonui/plugin')],
};
