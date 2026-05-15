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
          "01": "#FF7548",
          "02": "#FF9F80",
          "03": "#FFD4C6",
          "04": "#FFEAE4",
          "05": "#FFF1ED",
        },
        gray: {
          "01": "#0D0D0D",
          "02": "#5A5857",
          "03": "#A7A5A4",
          "04": "#D6D6D6",
        },
        background: "#F2F4F6",
      },
    },
  },
  plugins: [],
};
