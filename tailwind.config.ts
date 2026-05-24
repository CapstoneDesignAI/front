/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        main: {
          "01": "#F29B7F",
          "02": "#A8B89A",
          "03": "#7D9AAE",
          "04": "#F6E6DC",
          "05": "#FFF8F3",
        },
        gray: {
          "01": "#3A3A3A",
          "02": "#6F6762",
          "03": "#A59A93",
          "04": "#E8DDD5",
        },
        background: "#FFF8F3",
      },
    },
  },
  plugins: [],
};
