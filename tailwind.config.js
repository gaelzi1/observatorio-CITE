/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta basada en el turquesa del banner (#00B0AD).
        // Todos los tonos de texto cumplen contraste AA sobre blanco.
        cite: {
          turquesa: "#00B0AD", // barra del banner y realces
          teal: "#007A78", // turquesa oscuro: hero, texto secundario, foco
          "teal-dark": "#005654", // turquesa profundo: títulos y botones
          "teal-light": "#3F7A78", // turquesa apagado: texto tenue
          green: "#1c7a5e",
          coral: "#e8624f", // complementario del turquesa, para acentos
          "surface-light": "#f3fafa", // fondo con un toque turquesa
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
        DEFAULT: "#d9ecec",
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