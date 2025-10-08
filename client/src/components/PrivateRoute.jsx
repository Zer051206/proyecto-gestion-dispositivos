/**
 * @file PrivateRoute.jsx
 * @description Componente para proteger rutas que lee el estado de autenticación
 * desde el store global de Zustand.
 */
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore.js";
/**
 * @function PrivateRoute
 * @description Implementa la lógica de protección de rutas:
 * 1. Muestra un estado de carga mientras se verifica el token al inicio de la app.
 * 2. Si el usuario no está autenticado, renderiza el componente AuthRedirect.
 * 3. Si el usuario está autenticado, renderiza los componentes hijos (la ruta protegida).
 *
 * @param {object} props - Las propiedades del componente.
 * @param {React.ReactNode} props.children - Los componentes hijos a renderizar.
 * @returns {JSX.Element}
 */
const PrivateRoute = ({ children }) => {
  // 2. Leemos el estado directamente del store de Zustand.
  // Ya no se hace ninguna llamada a la API aquí.
  const { isAuthenticated, isLoading } = useAuthStore();

  // Si el store todavía está verificando la sesión inicial, muestra un loader.
  if (isLoading) {
    return (
      <div className="text-xl text-black bg-white rounded-2xl px-6 py-4">
        Cargando...
      </div>
    );
  }

  // Si no está autenticado, redirige.
  if (!isAuthenticated) {
    return <Navigate to="/auth-denegado" replace />;
  }

  // Si está autenticado, muestra el contenido protegido.
  return children;
};

export default PrivateRoute;
