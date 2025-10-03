/**
 * @file PrivateRoute.jsx
 * @module PrivateRoute
 * @description Componente de orden superior (High-Order Component) utilizado para proteger rutas.
 * Este componente es el encargado de verificar el estado de autenticación de un usuario
 * antes de renderizar los componentes hijos (la ruta solicitada).
 * @component
 * @requires react
 * @requires ../hooks/auth/useAuthStatus - Hook que verifica si la sesión está activa y su estado de carga.
 * @requires ./AuthRedirect - Componente que muestra el mensaje de acceso denegado y redirige al login.
 */
import React from "react";
import useAuthStatus from "../hooks/auth/useAuthStatus.js";
import AuthRedirect from "./AuthRedirect.jsx";

/**
 * @function PrivateRoute
 * @description Implementa la lógica de protección de rutas:
 * 1. Muestra un estado de carga mientras se verifica el token.
 * 2. Si el usuario no está autenticado, renderiza el componente AuthRedirect.
 * 3. Si el usuario está autenticado, renderiza los componentes hijos (la ruta protegida).
 *
 * @param {object} props - Las propiedades del componente.
 * @param {React.ReactNode} props.children - Los componentes que se renderizarán si el usuario está autenticado.
 * @returns {JSX.Element} El elemento JSX del contenido protegido, la pantalla de redirección, o el mensaje de carga.
 */
const PrivateRoute = ({ children }) => {
  // Obtiene el estado de autenticación y carga del hook personalizado
  const { isAuthenticated, isLoading } = useAuthStatus();

  // Si está cargando la verificación de autenticación, muestra un mensaje de espera.
  if (isLoading) {
    return (
      <div className="text-xl text-black bg-white rounded-2xl px-6 py-4">
        Cargando...
      </div>
    );
  }

  // Si NO está autenticado, redirige forzosamente al componente de acceso denegado.
  if (!isAuthenticated) {
    return <AuthRedirect />;
  }

  // Si la autenticación es exitosa, permite el acceso al contenido de la ruta.
  return children;
};

export default PrivateRoute;
