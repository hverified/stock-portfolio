const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(58 73 83)", // Elegant blue for accents
        secondary: "#1E293B", // Dark blue-gray for text
        accent: "#F59E0B", // Gold for highlights
        background: "#F9FAFB", // Light gray for the background
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
