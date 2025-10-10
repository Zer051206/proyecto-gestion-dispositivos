import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore.js";

/**
 * @function AdminRoute
 * @description Componente para proteger rutas anidadas que requieren rol de 'Admin'.
 * Si el usuario no es un administrador, lo redirige al dashboard.
 */
const AdminRoute = () => {
  const { user } = useAuthStore();

  // Si el usuario no es un 'Admin', lo redirigimos a la página principal del dashboard.
  // 'replace' evita que esta ruta "prohibida" se guarde en el historial del navegador.
  if (user?.rol !== "Admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Si es un Admin, renderiza el contenido de la ruta hija (usando Outlet).
  return <Outlet />;
};

export default AdminRoute;
