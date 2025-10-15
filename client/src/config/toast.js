/**
 * @file toastConfig.js
 * @description Configuración centralizada para la librería react-hot-toast.
 * Define la posición y los estilos por defecto para los diferentes tipos de notificaciones.
 */

export const toasterConfig = {
  position: "top-right",
  toastOptions: {
    duration: 5000, // Los toasts durarán 5 segundos
    // Estilos para notificaciones de éxito
    success: {
      style: {
        background: "#F0FFF4", // Un verde muy claro
        color: "#2D3A3A", // Nuestro text-main
        border: "1px solid #6A994E", // Nuestro primary
      },
      iconTheme: {
        primary: "#6A994E", // Color del icono
        secondary: "white",
      },
    },
    // Estilos para notificaciones de error
    error: {
      style: {
        background: "#FFF5F5", // Un rojo muy claro
        color: "#2D3A3A",
        border: "1px solid #BC4749", // Nuestro accent
      },
      iconTheme: {
        primary: "#BC4749", // Color del icono
        secondary: "white",
      },
    },
    // Estilos para notificaciones de carga (toast.promise)
    loading: {
      iconTheme: {
        primary: "#8B8589", // Neutral-taupe
        secondary: "white",
      },
    },
  },
};
