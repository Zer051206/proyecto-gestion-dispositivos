import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute.jsx";
import { WelcomePage } from "../components/WelcomePage.jsx";
import AuthRedirect from "../components/AuthRedirect.jsx";
import AuthRoutes from "./AuthRoutes.jsx";
import DashboardPage from "../components/Dashboard.jsx";
import CreateUserForm from "../components/users/CreateUserForm.jsx";
import Layout from "../components/Layout.jsx";
import DashboardDevice from "../components/devices/DashboardDevice.jsx";
import DashboardUser from "../components/users/DashboardUser.jsx";
import DashboardOperationCenter from "../components/operation-centers/DashboardOperationCenter.jsx";
import DashboardHistory from "../components/history/DashboardHistory.jsx";
import AdminRoute from "./AdminRoutes.jsx";

export function AppRoutes() {
  return (
    <Routes>
      {/* ==================================== */}
      {/* Rutas Públicas              */}
      {/* ==================================== */}

      {/* Ruta de la pagina de bienvenida de la aplicacion */}
      <Route path="/" element={<WelcomePage />} />
      {/* Rutas de Autenticación (Login) */}

      <Route path="/auth/*" element={<AuthRoutes />} />

      {/* Ruta de redirección para errores de autenticación (ej: token de refresco fallido) */}
      <Route path="/auth-denegado" element={<AuthRedirect />} />

      {/* ==================================== */}
      {/* Rutas Privadas              */}
      {/* ==================================== */}
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/dispositivos" element={<DashboardDevice />} />
        <Route path="/dashboard/historial" element={<DashboardHistory />} />

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
