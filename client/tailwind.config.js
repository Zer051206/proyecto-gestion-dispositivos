// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- PALETA PRINCIPAL ---
        primary: "#6A994E", // Verde Salvia
        "primary-dark": "#4F7942", // Verde Bosque (para hover)
        secondary: "#FFFFFF", // Blanco (para tarjetas)
        accent: "#BC4749", // Terracota
        "accent-secondary": "#D4A017", // Mostaza / Ocre
        "text-main": "#2D3A3A", // Gris Carbón
        "text-light": "#FFFFFF",
        background: "#F5F5DC", // Lino / Hueso

        // --- NEUTROS ADICIONALES ---
        "neutral-taupe": "#8B8589",
        "neutral-cream": "#FFFFF0",

        // --- COLORES DE ESTADO ---
        success: "#28A745",
        error: "#DC3545",
        warning: "#FFC107",
      },
    },
  },
  plugins: [],
};
