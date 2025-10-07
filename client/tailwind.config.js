// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- NOMBRES SEMÁNTICOS ---

        // Paleta 3: Natural y Organizado
        // Para activarla: comenta las otras y descomenta este bloque.
        primary: "#6A994E", // Verde Salvia
        secondary: "#FFFFFF", // Fondo de tarjetas
        accent: "#BC4749", // Terracota
        "text-main": "#2D3A3A", // Texto principal (Gris Carbón)
        "text-light": "#FFFFFF", // Texto sobre fondos oscuros
        background: "#F5F5DC", // Fondo de la página (Lino / Hueso)

        // --- COLORES DE ESTADO (SEMÁNTICOS) ---
        // Estos no cambian entre temas.
        success: "#28A745",
        error: "#DC3545",
        warning: "#FFC107",
      },
    },
  },
  plugins: [],
};
