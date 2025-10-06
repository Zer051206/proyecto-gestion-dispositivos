/**
 * @file WelcomePage.jsx
 * @description Página de inicio inteligente que redirige a los usuarios autenticados
 * o muestra las opciones de login/registro a los visitantes.
 */
import React from "react";
import { Link, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserPlus, faLock } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../stores/authStore.js"; // 1. Importamos nuestro store global

export function WelcomePage() {
  // 2. Obtenemos el estado de autenticación y carga del store
  const { isAuthenticated, isLoading } = useAuthStore();

  // 3. Lógica de renderizado condicional

  // Mientras se verifica el estado de la sesión, mostramos un loader
  if (isLoading) {
    return (
      <div className="text-xl text-black bg-white rounded-2xl px-6 py-4">
        Verificando sesión...
      </div>
    );
  }

  // Si el usuario ya está autenticado, lo redirigimos al dashboard
  if (isAuthenticated) {
    // Usamos el componente Navigate para una redirección declarativa
    return <Navigate to="/dashboard" replace />;
  }

  // Si no está cargando y no está autenticado, mostramos la bienvenida
  return (
    <div className="flex flex-col items-center gap-10 p-4 w-full min-h-screen justify-center animate-fade-in">
      {/* Contenedor del logo y el texto de bienvenida */}
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="w-24 h-24 mb-8 bg-white rounded-full flex items-center justify-center shadow-xl shadow-gray-500">
          <FontAwesomeIcon
            icon={faLock}
            className="text-4xl text-emerald-700"
          />
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-emerald-700 mb-4">
          GESTIÓN DE DISPOSITIVOS
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 max-w-lg">
          Sistema de control de dispositivos y acceso seguro.
        </p>
      </div>

      {/* Contenedor de los "cajones" de navegación */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 w-full">
        {/* Cajón de Iniciar Sesión */}
        <Link
          to="/auth/login"
          className="flex flex-col items-center justify-center p-8 w-44 h-44 bg-emerald-100 hover:bg-emerald-300 rounded-lg shadow-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-emerald-400"
          aria-label="Ir a la página de inicio de sesión"
        >
          <div className="text-emerald-700 mb-2 ">
            <FontAwesomeIcon icon={faUser} className="w-16 h-16" />
          </div>
          <span className="text-lg font-bold text-gray-800">
            Iniciar Sesión
          </span>
        </Link>

        {/* Cajón de Registrarse */}
        <Link
          to="/auth/register"
          className="flex flex-col items-center justify-center p-8 w-44 h-44 bg-slate-100 hover:bg-slate-300 rounded-lg shadow-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-slate-400"
          aria-label="Ir a la página de registro de nuevo usuario"
        >
          <div className="text-slate-700 mb-2">
            <FontAwesomeIcon icon={faUserPlus} className="w-16 h-16" />
          </div>
          <span className="text-lg font-bold text-gray-800">
            Solicitar Acceso
          </span>
        </Link>
      </div>
    </div>
  );
}
