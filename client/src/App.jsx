import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppRoutes } from "./routes/index.jsx";
import { useAuthStore } from "./stores/authStore.js";
import { toasterConfig } from "./config/toast.js";
import "./App.css";

/**
 * @function App
 * @description Componente raíz de la aplicación.
 * Configura el enrutador, el proveedor de notificaciones (Toaster) y
 * ejecuta la verificación inicial de la sesión de autenticación.
 * @returns {JSX.Element}
 */
function App() {
  // Obtiene la acción para verificar el estado de la sesión desde el store global
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  // useEffect se ejecuta una sola vez al cargar la aplicación para verificar si hay una sesión activa
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <BrowserRouter>
      {/* 2. El componente Toaster se configura usando el objeto importado.
          El spread operator (...) pasa todas las propiedades (position, toastOptions) de una sola vez. */}
      <Toaster {...toasterConfig} />

      {/* El <main> actúa como un contenedor general para todas las páginas */}
      <main className="w-full min-h-screen">
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
}

export default App;
