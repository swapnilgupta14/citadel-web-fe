/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#000000",
          secondary: "#111111",
          tertiary: "#2C2C2C",
        },
        primary: {
          DEFAULT: "#1BEA7B",
          50: "#E6FFF3",
          100: "#CCFFE7",
          200: "#99FFCF",
          300: "#66FFB7",
          400: "#33FF9F",
          500: "#1BEA7B",
          600: "#15BB62",
          700: "#108C49",
          800: "#0B5D31",
          900: "#052E18",
        },
        border: {
          DEFAULT: "#1A1A1A",
        },
        slider: {
          bg: "#161616",
        },
        button: {
          search: "rgba(255, 255, 255, 0.16)",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "rgba(255, 255, 255, 0.7)",
          muted: "#2C2C2C",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      screens: {
        xs: "320px",
        "sm-phone": "375px",
        "lg-phone": "414px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
