// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- NOMBRES SEMÁNTICOS ---

        // Paleta 1: Profesional y Confiable (ACTIVA POR DEFECTO)
        primary: "#005A9C", // Color principal para acciones (botones, enlaces)
        secondary: "#FFFFFF", // Color para el fondo de las tarjetas/paneles
        accent: "#F5A623", // Color para destacar o notificaciones secundarias
        "text-main": "#1E293B", // Color principal del texto (casi negro)
        "text-light": "#FFFFFF", // Color del texto sobre fondos oscuros
        background: "#F4F6F8", // Color de fondo de la página

        /*
        //Paleta 2: Moderno y Enfocado (Dark Mode)
        //Para activarla: comenta la Paleta 1 y descomenta este bloque.
        'primary': '#38A169',      // Verde Azulado (Teal)
        'secondary': '#2D3748',    // Gris Pizarra (fondo de tarjetas)
        'accent': '#38A169',       // Mismo que el primario en este tema
        'text-main': '#E2E8F0',    // Texto principal (casi blanco)
        'text-light': '#1A202C',   // Texto sobre fondos claros (botones)
        'background': '#1A202C',   // Fondo de la página (Carbón Oscuro)
        */

        /*
        // Paleta 3: Natural y Organizado
        // Para activarla: comenta las otras y descomenta este bloque.
        'primary': '#6A994E',      // Verde Salvia
        'secondary': '#FFFFFF',    // Fondo de tarjetas
        'accent': '#BC4749',       // Terracota
        'text-main': '#2D3A3A',    // Texto principal (Gris Carbón)
        'text-light': '#FFFFFF',   // Texto sobre fondos oscuros
        'background': '#F5F5DC',   // Fondo de la página (Lino / Hueso)
        */

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
