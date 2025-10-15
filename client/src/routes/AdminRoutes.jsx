import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore.js";

/**
 * @file AdminRoutes.jsx
 * @module Routes/Admin
 * @description Componente de enrutamiento que actúa como un "guardia" para proteger rutas anidadas,
 * garantizando que solo los usuarios con el rol de 'Admin' puedan acceder a ellas.
 */

/**
 * @function AdminRoute
 * @description Un componente de tipo "Layout Route". Comprueba el rol del usuario autenticado.
 * Si el usuario es un 'Admin', renderiza el componente hijo correspondiente a la ruta anidada a través de `<Outlet />`.
 * Si no es un 'Admin', redirige al usuario al dashboard principal.
 * @returns {JSX.Element} El componente de la ruta anidada si el usuario está autorizado, o un componente de redirección.
 */
const AdminRoute = () => {
  // Se obtiene la información del usuario desde el store global de autenticación.
  const { user } = useAuthStore();

  // Se verifica si el rol del usuario NO es 'Admin'. El 'optional chaining' (?.) previene errores si 'user' es nulo.
  if (user?.rol !== "Admin") {
    // Si no está autorizado, se utiliza el componente <Navigate> para redirigir.
    // 'replace' es una prop crucial que reemplaza la entrada actual en el historial de navegación,
    // evitando que el usuario pueda volver a la página prohibida con el botón "atrás" del navegador.
    return <Navigate to="/dashboard" replace />;
  }

  // Si la verificación es exitosa, <Outlet /> actúa como un marcador de posición que renderizará
  // el componente de la ruta hija que coincida con la URL actual.
  return <Outlet />;
};

export default AdminRoute;
