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
          // Reemplazamos 'cream' por un gris frío muy claro
          "surface-light": "#f8fafc", 
        },
      },
      
      textColor: ({ theme }) => ({
        primary: theme("colors.cite.teal-dark"),
        secondary: theme("colors.cite.teal"),
        muted: theme("colors.cite.teal-light"),
        accent: theme("colors.cite.coral"),
        success: theme("colors.cite.green"),
        // El texto inverso ahora contrasta contra fondos oscuros
        inverse: "#ffffff", 
      }),

      backgroundColor: ({ theme }) => ({
        // Aplicamos el nuevo color base
        base: theme("colors.cite.surface-light"), 
        surface: "#ffffff",
        primary: theme("colors.cite.teal-dark"),
        accent: theme("colors.cite.coral"),
      }),

      borderColor: ({ theme }) => ({
        DEFAULT: "#e5e7eb",
        focus: theme("colors.cite.teal"),
        accent: theme("colors.cite.coral"),
      }),

      fontFamily: {
        display: ["Georgia", "'Times New Roman'", "serif"],
        sans: ["'Segoe UI'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};