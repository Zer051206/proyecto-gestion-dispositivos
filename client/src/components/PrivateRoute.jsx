/**
 * @file PrivateRoute.jsx
 * @module Components
 * @description Componente de "guardia de ruta" (Route Guard) que protege el acceso a las rutas privadas.
 * Se integra con el store global de Zustand para leer el estado de autenticación del usuario.
 * @requires react
 * @requires react-router-dom
 * @requires ../stores/authStore.js
 */
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore.js";

/**
 * @function PrivateRoute
 * @description Componente de orden superior que envuelve las rutas privadas. Su comportamiento es el siguiente:
 * 1. Muestra un indicador de carga mientras el `authStore` verifica el estado inicial de la sesión (`isLoading`).
 * 2. Si el usuario no está autenticado (`!isAuthenticated`), lo redirige a una página de acceso denegado.
 * 3. Si el usuario está autenticado, renderiza los componentes `children` (la página protegida que se quiere mostrar).
 * @param {object} props - Las propiedades del componente.
 * @param {React.ReactNode} props.children - El componente de la ruta protegida que se renderizará si la autenticación es exitosa.
 * @returns {JSX.Element} El componente de la ruta protegida o el componente de redirección.
 */
const PrivateRoute = ({ children }) => {
  // Obtiene el estado de autenticación y carga desde el store global.
  const { isAuthenticated, isLoading } = useAuthStore();

  // Muestra un indicador de carga mientras se verifica la sesión inicial.
  // Esto previene un parpadeo o redirección prematura al cargar la aplicación.
  if (isLoading) {
    return (
      <div className="text-xl text-black bg-white rounded-2xl px-6 py-4">
        Cargando...
      </div>
    );
  }

  // Si no está autenticado, redirige al usuario.
  // `replace` evita que la ruta actual se añada al historial del navegador.
  if (!isAuthenticated) {
    return <Navigate to="/auth-denegado" replace />;
  }

  // Si el usuario está autenticado, permite el acceso y renderiza la página solicitada.
  return children;
};

export default PrivateRoute;
