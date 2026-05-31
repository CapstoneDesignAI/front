/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        main: {
          DEFAULT: "#739E6B",
          orange: "#F08057",
          green: "#739E6B",
          blue: "#7094AD",
          "light-orange": "#F6E6DC",
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
