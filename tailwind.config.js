/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cite: {
          teal: "#2f6273",
          "teal-dark": "#234c5a",
          "teal-light": "#5b8b98",
          green: "#1c7a5e",
          coral: "#e8624f",
          cream: "#f7f6f2",
        },
      },
      fontFamily: {
        display: ["Georgia", "'Times New Roman'", "serif"],
        sans: ["'Segoe UI'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
