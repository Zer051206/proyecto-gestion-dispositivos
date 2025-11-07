/**
 * @file index.jsx
 * @module Routes
 * @description Componente principal de enrutamiento de la aplicación.
 * Define la estructura de todas las rutas, separando las públicas de las privadas y
 * aplicando layouts y guardias de autorización basados en roles.
 * @requires react
 * @requires react-router-dom
 * @requires ../components/PrivateRoute.jsx
 * @requires ./AdminRoutes.jsx
 * @requires ../components/Layout.jsx
 * @requires ../components/WelcomePage.jsx
 * @requires ../components/AuthRedirect.jsx
 * @requires ./AuthRoutes.jsx
 * @requires ../components/DashboardPage.jsx
 * @requires ../components/users/CreateUserForm.jsx
 * @requires ../components/devices/DashboardDevice.jsx
 * @requires ../components/users/DashboardUser.jsx
 * @requires ../components/operation-centers/DashboardOperationCenter.jsx
 * @requires ../components/history/DashboardHistory.jsx
 */
import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute.jsx";
import { WelcomePage } from "../components/WelcomePage.jsx";
import AuthRedirect from "../components/AuthRedirect.jsx";
import AuthRoutes from "./AuthRoutes.jsx";
import DashboardPage from "../components/Dashboard.jsx";
import Layout from "../components/Layout.jsx";
import DashboardDevice from "../components/devices/DashboardDevice.jsx";
import DashboardUser from "../components/users/DashboardUser.jsx";
import DashboardOperationCenter from "../components/operation-centers/DashboardOperationCenter.jsx";
import DashboardHistory from "../components/history/DashboardHistory.jsx";
import DashboardRequirement from "../components/requirements/DashboardRequirement.jsx";
import AdminRoute from "./AdminRoutes.jsx";

/**
 * @function AppRoutes
 * @description Renderiza el árbol de rutas de la aplicación utilizando `react-router-dom`.
 * Implementa un patrón de rutas anidadas para gestionar layouts persistentes y la protección de rutas.
 * @returns {JSX.Element} El componente de enrutamiento principal.
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* ==================================== */}
      {/* Rutas Públicas                       */}
      {/* ==================================== */}
      {/* Estas rutas son accesibles para cualquier visitante, sin necesidad de autenticación. */}
      {/* Ruta de la pagina de bienvenida de la aplicacion */}
      <Route path="/" element={<WelcomePage />} />
      {/* Rutas de Autenticación (Login) */}
      <Route path="/auth/*" element={<AuthRoutes />} />
      {/* Ruta de redirección para errores de autenticación (ej: token de refresco fallido) */}
      <Route path="/auth-denegado" element={<AuthRedirect />} />

      {/* ==================================== */}
      {/* Rutas Privadas                       */}
      {/* ==================================== */}
      {/* Esta es una "Layout Route". Envuelve un grupo de rutas en dos capas de seguridad:
          1. <PrivateRoute>: Asegura que el usuario esté autenticado.
          2. <Layout />: Provee la estructura visual común (header, sidebar) a todas las páginas anidadas.
      */}
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {/* --- Rutas para TODOS los usuarios autenticados (Admins y Encargados) --- */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/dispositivos" element={<DashboardDevice />} />
        <Route path="/dashboard/historial" element={<DashboardHistory />} />
        <Route
          path="/dashboard/requerimientos"
          element={<DashboardRequirement />}
        />

        {/* --- Rutas anidadas SOLO PARA ADMINS --- */}
        {/* Envolvemos otro grupo de rutas con el guardia <AdminRoute />.
            Un "Encargado" que intente acceder a estas URLs será redirigido. */}
        <Route element={<AdminRoute />}>
          <Route path="/dashboard/usuarios" element={<DashboardUser />} />
          <Route
            path="/dashboard/centros-operacion"
            element={<DashboardOperationCenter />}
          />
        </Route>
      </Route>
    </Routes>
  );
}
