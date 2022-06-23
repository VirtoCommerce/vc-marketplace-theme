module.exports = {
  content: ["./index.html", "./client-app/**/*.{vue,js,ts,jsx,tsx}"],

  theme: {
    fontFamily: {
      lato: ["Lato", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
      "roboto-condensed": ["Roboto Condensed", "sans-serif"],
    },

    extend: {
      colors: {
        yellow: {
          // TODO: delete when switching all components to the "primary" and "secondary" colors
          500: "#205527",
        },

        // Generated with https://www.tailwindshades.com/
        primary: {
          DEFAULT: "#205527",
          50: "#FEFBF7",
          100: "#FDF3E4",
          200: "#FAE1BF",
          300: "#F6D099",
          400: "#F3BE74",
          500: "#205527",
          600: "#EC951A",
          700: "#BE7610",
          800: "#8A560C",
          900: "#563607",
        },

        secondary: {
          DEFAULT: "#151B1E",
          50: "#617C8A",
          100: "#58717E",
          200: "#475C66",
          300: "#37464E",
          400: "#263136",
          500: "#151B1E",
          600: "#000000",
          700: "#000000",
          800: "#000000",
          900: "#000000",
        },

        info: {
          DEFAULT: "#38BDF8",
          50: "#E9F8FE",
          100: "#D6F1FE",
          200: "#AEE4FC",
          300: "#87D7FB",
          400: "#5FCAF9",
          500: "#38BDF8",
          600: "#08A8EF",
          700: "#0782B9",
          800: "#055C83",
          900: "#03364D",
        },

        success: {
          DEFAULT: "#55AB56",
          50: "#D0E8D0",
          100: "#C2E1C3",
          200: "#A7D3A7",
          300: "#8CC68C",
          400: "#70B871",
          500: "#55AB56",
          600: "#428643",
          700: "#306030",
          800: "#1D3B1D",
          900: "#0A150B",
        },

        warning: {
          DEFAULT: "#FA8B3E",
          50: "#FFF7F1",
          100: "#FEEBDD",
          200: "#FDD3B5",
          300: "#FCBB8E",
          400: "#FBA366",
          500: "#FA8B3E",
          600: "#F96A07",
          700: "#C35305",
          800: "#8C3C04",
          900: "#552402",
        },

        error: {
          DEFAULT: "#F66565",
          50: "#FFFFFF",
          100: "#FFFFFF",
          200: "#FDD9D9",
          300: "#FBB2B2",
          400: "#F88C8C",
          500: "#F66565",
          600: "#F33030",
          700: "#DE0D0D",
          800: "#A90A0A",
          900: "#740707",
        },

        link: {
          DEFAULT: "#00739E",
          hover: "#00678d",
        },

        /**
         * Custom colors
         */
        red: {
          50: "#FFFFFF",
          100: "#FFEDED",
          200: "#FFC4C4",
          300: "#FF9C9C",
          400: "#FF7373",
          500: "#FF4A4A",
          600: "#FF1212",
          700: "#D90000",
          800: "#A10000",
          900: "#690000",
        },
      },
      boxShadow: {
        't-sm': '0 -1px 2px 0 rgba(0, 0, 0, 0.05)',
        't': '0 -1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);',
        't-md': '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        't-lg': '0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        't-xl': '0 -20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        't-2xl': '0 -25px 50px -12px rgba(0, 0, 0, 0.25)',
        't-3xl': '0 -35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
    },
  },

  plugins: [require("@tailwindcss/line-clamp")],
};
