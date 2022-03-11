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
        // Generated with https://www.tailwindshades.com/
        yellow: {
          DEFAULT: '#205527',
          '50': '#67C673',
          '100': '#58C066',
          '200': '#41AE50',
          '300': '#369042',
          '400': '#2B7335',
          '500': '#205527',
          '600': '#112C14',
          '700': '#010302',
          '800': '#000000',
          '900': '#000000',
        },
        red: {
          500: "#FF2B00",
        },
        cyan: {
          500: "#5294AD",
          700: "#00739E",
        },

        primary: {
          DEFAULT: "var(--color-primary, #205527)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary, #151b1e)",
        },
        focus: {
          DEFAULT: "#00739E",
        },

        info: "#292D3B",
        success: "#479048",
        warning: "#205527",
        danger: "#EC6A5E",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
