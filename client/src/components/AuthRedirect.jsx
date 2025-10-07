/**
 * @file AuthRedirect.jsx
 * @description Componente que se muestra cuando un usuario no autenticado intenta acceder a una ruta protegida.
 */
import React from "react";
import { useNavigate } from "react-router-dom";

const AuthRedirect = () => {
  const navigate = useNavigate();
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
