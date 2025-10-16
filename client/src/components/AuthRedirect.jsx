/**
 * @file AuthRedirect.jsx
 * @module Components
 * @description Componente funcional que se renderiza cuando un usuario no autenticado intenta
 * acceder a una ruta protegida o cuando su sesión expira. Muestra un mensaje claro
 * de "Acceso Denegado" y proporciona una acción para redirigir a la página de inicio de sesión.
 * @requires react
 * @requires react-router-dom
 */
import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * @function AuthRedirect
 * @description Renderiza una pantalla de error de acceso y proporciona un botón para que el usuario
 * pueda navegar fácilmente a la página de login.
 * @returns {JSX.Element} El elemento JSX que representa la pantalla de acceso denegado.
 */
const AuthRedirect = () => {
  // Hook de React Router para la navegación programática.
  const navigate = useNavigate();

  /**
   * @function handleLoginClick
   * @description Manejador de eventos que se ejecuta al hacer clic en el botón.
   * Navega al usuario a la ruta del formulario de inicio de sesión.
   * @returns {void}
   */
  const handleLoginClick = () => {
    navigate("/auth/login");
  };

  return (
    // El fondo ahora usa nuestro color de tema 'background'
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 bg-background">
      {/* La tarjeta usa el color 'secondary' (blanco en este tema) y el texto principal 'text-main' */}
      <div className="bg-secondary p-8 rounded-lg shadow-xl text-center max-w-sm w-full text-text-main">
        {/* El título usa el color 'accent' (terracota) para indicar una alerta o acción importante */}
        <h2 className="text-3xl font-bold mb-4 text-accent">Acceso Denegado</h2>

        <p className="mb-6">
          No tienes permiso para ver esta página. Por favor, inicia sesión para
          continuar.
        </p>

        {/* El botón usa el color 'primary' (verde) para la acción principal */}
        <button
          onClick={handleLoginClick}
          className="w-full px-4 py-3 bg-primary hover:opacity-90 text-text-light font-bold rounded-lg transition-opacity duration-300"
        >
          Ir a Iniciar Sesión
        </button>
      </div>
    </div>
  );
};

export default AuthRedirect;
