/**
 * @file AuthRoutes.jsx
 * @module Routes
 * @description Define las rutas anidadas para la sección de autenticación (ej. /auth/login).
 * Utiliza la carga diferida (lazy loading) de React con Suspense para optimizar el rendimiento,
 * cargando el componente del formulario de login solo cuando es necesario.
 * @requires react
 * @requires react-router-dom
 */
import React from "react";
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import LoginFormSkeleton from "../components/auth/LoginFormSkeleton.jsx";

// Se utiliza React.lazy para importar el componente del formulario de login de forma diferida.
// Esto significa que el código de LoginForm.jsx no se descargará hasta que el usuario navegue a /auth/login.
const LoginForm = lazy(() => import("../components/auth/LoginForm.jsx"));

/**
 * @function AuthRoutes
 * @description Componente que encapsula las rutas específicas de la autenticación.
 * Al ser importado en el enrutador principal (`AppRoutes`) bajo el path "/auth/*",
 * este componente gestiona las sub-rutas como "/login".
 * @returns {JSX.Element} Un conjunto de rutas envueltas en un componente Suspense.
 */
export default function AuthRoutes() {
  return (
    // Suspense muestra un 'fallback' (ej. un mensaje de "Cargando...") mientras el
    // componente LoginForm se descarga y se prepara para ser renderizado.
    <Suspense fallback={<LoginFormSkeleton />}>
      <Routes>
        {/* Define la ruta específica para el login, accesible en "/auth/login" */}
        <Route path="login" element={<LoginForm />} />
        {/* En el futuro, aquí podrían ir otras rutas de autenticación como /recuperar-contraseña */}
      </Routes>
    </Suspense>
  );
}
