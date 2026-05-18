/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#5C868E",
        secondary: "#97BFAB",
        grey: {
          800: "#3D3D3D",
          500: "#828282",
        },
        red: "#990000",
      },
      fontFamily: {
        primary: ["Poppins_400Regular"],
        "primary-medium": ["Poppins_500Medium"],
        "primary-semibold": ["Poppins_600SemiBold"],
        "primary-bold": ["Poppins_700Bold"],
        secondary: ["LifeSavers_400Regular"],
        "secondary-bold": ["LifeSavers_700Bold"],
        "secondary-extrabold": ["LifeSavers_800ExtraBold"],
      },
    },
  },
  plugins: [],
};
