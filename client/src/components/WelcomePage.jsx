/**
 * @file WelcomePage.jsx
 * @module Components
 * @description Componente funcional que actúa como la página de bienvenida y el punto de entrada principal
 * para los usuarios. Es una "página inteligente" que decide qué mostrar basándose en el estado
 * de autenticación del usuario.
 * @requires react
 * @requires react-router-dom
 * @requires @fortawesome/react-fontawesome
 * @requires ../stores/authStore.js
 */
import React from "react";
import { Link, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../stores/authStore.js";

/**
 * @function WelcomePage
 * @description Renderiza la página de bienvenida. Su comportamiento es condicional:
 * 1. Muestra un estado de "Verificando sesión..." mientras el `authStore` comprueba el estado inicial.
 * 2. Si el usuario ya está autenticado, lo redirige automáticamente al `/dashboard`.
 * 3. Si el usuario no está autenticado, muestra el mensaje de bienvenida y un enlace prominente para iniciar sesión.
 * @returns {JSX.Element} El componente renderizado para la página de bienvenida.
 */
export function WelcomePage() {
  // Obtiene el estado de autenticación y de carga desde el store global de Zustand.
  const { isAuthenticated, isLoading } = useAuthStore();

  // Muestra un indicador de carga mientras se verifica el estado de la sesión.
  if (isLoading) {
    return <div className="text-xl text-text-main">Verificando sesión...</div>;
  }

  // Si el usuario está autenticado, redirige a la página principal del dashboard.
  // `replace` evita que esta página de bienvenida se añada al historial del navegador.
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si no está cargando y no está autenticado, muestra la interfaz de bienvenida.
  return (
    <div className="flex flex-col items-center gap-10 p-4 w-full min-h-screen justify-center animate-fade-in bg-background">
      <div className="flex flex-col items-center mb-5 text-center">
        <div className="w-24 h-24 mb-8 bg-secondary rounded-full flex items-center justify-center shadow-xl">
          <FontAwesomeIcon icon={faLock} className="text-4xl text-primary" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary mb-4">
          GESTIÓN DE DISPOSITIVOS
        </h1>
        <p className="text-lg sm:text-xl text-text-main max-w-lg">
          Sistema de control de dispositivos y acceso seguro.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-8 w-full">
        {/* Enlace principal a la página de inicio de sesión */}
        <Link
          to="/auth/login"
          className="flex flex-col items-center justify-center p-8 w-[250px] h-[200px] bg-primary/10 hover:bg-primary/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/50"
        >
          <div className="text-primary mb-2">
            <FontAwesomeIcon icon={faUser} className="w-16 h-16" />
          </div>
          <span className="text-lg font-bold text-text-main">
            Iniciar Sesión
          </span>
        </Link>
      </div>
    </div>
  );
}
