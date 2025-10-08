import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute.jsx";
import { WelcomePage } from "../components/WelcomePage.jsx";
import AuthRedirect from "../components/AuthRedirect.jsx";
import AuthRoutes from "./AuthRoutes.jsx";
import DashboardPage from "../components/Dashboard.jsx";
import CreateUserForm from "../components/users/CreateUserForm.jsx";

export function AppRoutes() {
  return (
    <Routes>
      {/* ==================================== */}
      {/* Rutas Públicas              */}
      {/* ==================================== */}
      {/* Ruta de la pagina de bienvenida de la aplicacion */}
      <Route path="/" element={<WelcomePage />} />
      {/* Rutas de Autenticación (Login, Register) - Rutas anidadas */}
      <Route path="/auth/*" element={<AuthRoutes />} />
      {/* Ruta de redirección para errores de autenticación (ej: token de refresco fallido) */}
      <Route path="/auth-denegado" element={<AuthRedirect />} />

      <Route path="/dashboard" element={<DashboardPage />} />
      {/* ==================================== */}
      {/* Rutas Privadas              */}
      {/* ==================================== */}
      {/* <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      /> */}
      <Route
        path="/usuarios"
        element={
          <PrivateRoute>
            <CreateUserForm />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
