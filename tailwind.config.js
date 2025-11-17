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
          dark: "#133422",
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
        serif: ["Roboto Serif", "Georgia", "serif"],
      },
      screens: {
        xs: "320px",
        "sm-phone": "375px",
        "lg-phone": "414px",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
