/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#161622",
        secondary: {
          DEFAULT: "#FF9C01",
          100: "#FF9001",
          200: "#FF8E01",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        white: {
          DEFAULT: "#FFFFFF",
          100: "#F8F9FA",
        },
        gray: {
          100: "#CDCDE0",
          200: "#54595E",
          300: "#8391A1",
        },
        green: {
          DEFAULT: "#74B318",
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
        urbanistblack: ["Urbanist-Black", "sans-serif"],
        urbanistmedium: ["Urbanist-Medium", "sans-serif"],
        urbanistregular: ["Urbanist-Regular", "sans-serif"],
        urbanistbold: ["Urbanist-Bold", "sans-serif"],
        urbanistsemibold: ["Urbanist-SemiBold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
