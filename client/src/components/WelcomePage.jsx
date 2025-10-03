/**
 * @file WelcomePage.jsx
 * @module WelcomePage
 * @description Componente funcional que sirve como la página de inicio de la aplicación,
 * utilizando la paleta de colores de seguridad (Verde Esmeralda) y Font Awesome icons.
 * @component
 * @requires react
 * @requires react-router-dom/Link
 * @requires @fortawesome/react-fontawesome
 * @requires @fortawesome/free-solid-svg-icons (faUser, faUserPlus, faLock)
 */
import React from "react";
import { Link } from "react-router-dom";
// Importar componentes y hooks de Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserPlus, faLock } from "@fortawesome/free-solid-svg-icons"; // 💡 Iconos específicos

/**
 * @function WelcomePage
 * @description Renderiza la interfaz principal de bienvenida con el título de la aplicación
 * y dos "cajones" de navegación para las funcionalidades de autenticación (Login y Register).
 *
 * @returns {JSX.Element} El elemento JSX que representa la página de bienvenida.
 */
export function WelcomePage() {
  return (
    <div className="flex flex-col items-center gap-10 p-4 w-full min-h-screen justify-center">
      {/* Contenedor del logo y el texto de bienvenida */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-24 h-24 mb-8 bg-white rounded-full flex items-center justify-center shadow-xl shadow-gray-500">
          <FontAwesomeIcon
            icon={faLock}
            className="text-4xl text-emerald-700"
          />
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-emerald-700 mb-4">
          GESTIÓN DE DISPOSITIVOS
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 max-w-lg text-center">
          Sistema de control de dispositivos y acceso seguro.
        </p>
      </div>

      {/* Contenedor de los "cajones" de navegación */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-2 sm:gap-12 w-full">
        {/* Cajón de Iniciar Sesión (Ruta principal: Verde Esmeralda) */}
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

        {/* Cajón de Registrarse (Ruta secundaria: Gris Azulado) */}
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
