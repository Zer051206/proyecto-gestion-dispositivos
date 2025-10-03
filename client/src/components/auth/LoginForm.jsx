/**
 * @file LoginForm.jsx
 * @module LoginForm
 * @description Componente funcional que renderiza el formulario de inicio de sesión.
 * Incluye la lógica de visibilidad de la contraseña y navegación, utilizando
 * la paleta de colores de seguridad (Verde Oliva/Esmeralda).
 * * @component
 * @requires react-router-dom/Link
 * @requires @fortawesome/react-fontawesome
 * @requires @fortawesome/free-solid-svg-icons (faSignOutAlt)
 * @requires ../../hooks/auth/useLoginForm
 * @requires ../../hooks/useGoBackHome
 * @requires ../../hooks/utils/usePasswordToggle
 */
import { Link, useNavigate } from "react-router-dom";
// IMPORT DE HOOKS
import { useLoginForm } from "../../hooks/auth/useLoginForm.js";
import { usePasswordToggle } from "../../hooks/utils/usePasswordToggle.js";

// IMPORT DE ICONOS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

export default function LoginForm() {
  // Hook para la funcionalidad del botón "Volver" a la página de inicio
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  // Hook para alternar la visibilidad de la contraseña
  // Icon aquí será el componente <FontAwesomeIcon /> correcto (ej. FaEye o FaEyeSlash)
  const [inputType, Icon, toggleVisibility] = usePasswordToggle();

  // Hook principal para manejar el estado del formulario y la lógica de autenticación
  const {
    email,
    password,
    handleLogin,
    handleEmailChange,
    handlePasswordChange,
    error,
  } = useLoginForm();

  // Simulando el error para la demostración de estilo
  // const error = 'Credenciales incorrectas. Intente de nuevo.';

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      {/* Botón de navegación para volver a la página principal */}
      <button
        type="button"
        onClick={goBack}
        className="
            absolute top-1 right-4 
            bg-red-600 hover:bg-red-700 
            text-white font-bold 
            p-4 rounded-lg 
            flex flex-col items-center justify-center 
            transition-colors duration-300
            text-sm w-16 h-16 sm:w-20 sm:h-20
          "
      >
        {/* Ícono de "Volver/Salir" */}
        <FontAwesomeIcon icon={faSignOutAlt} className="text-xl sm:text-xl" />
        <span className="text-xs sm:text-sm mt-1">Volver</span>
      </button>

      <form
        className="bg-white p-6 rounded-lg shadow-xl shadow-gray-700 w-[98%] max-w-sm mt-[75px] mb-[50px]"
        onSubmit={handleLogin}
      >
        {/* Título */}
        <h2 className="text-2xl font-bold mb-[10px] text-center text-gray-800">
          Acceso de Seguridad
        </h2>

        <fieldset className="p-4 rounded-md mb-3 border border-gray-400 shadow-md shadow-gray-400">
          {/* Leyenda */}
          <legend className="p-2 text-md bg-white font-semibold text-emerald-700">
            Datos de la cuenta
          </legend>
          <div className="space-y-4">
            {/* Input de Correo Electrónico */}
            <label className="block">
              <span className="text-gray-700 text-md">Correo electrónico:</span>
              <input
                name="correo"
                type="email"
                value={email}
                onChange={handleEmailChange}
                className="mt-1 block w-full rounded-md p-[5px] font-semibold outline-0 border-2 border-gray-400 bg-gray-50 shadow-lg focus:border-emerald-700 focus:ring-2 focus:ring-emerald-300 transition-all duration-200 ease-in-out hover:border-emerald-500"
                autoComplete="off"
              />
            </label>

            {/* Input de Contraseña con alternador de visibilidad */}
            <label className="block relative">
              <span className="text-gray-700 text-md">Contraseña:</span>
              <input
                name="password"
                type={inputType}
                value={password}
                onChange={handlePasswordChange}
                className="mt-1 block w-full rounded-md font-semibold p-[5px] outline-0 border-2 border-gray-400 bg-gray-50 shadow-lg focus:border-emerald-700 focus:ring-2 focus:ring-emerald-300 transition-all duration-200 ease-in-out hover:border-emerald-500 pr-10"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={toggleVisibility}
                className="absolute inset-y-0 right-[-8px] top-7 flex items-center pr-3 text-gray-400 outline-none"
              >
                {/* Ícono de visibilidad de la contraseña (proporcionado por usePasswordToggle) */}
                <Icon />
              </button>
            </label>
          </div>
        </fieldset>

        {/* Mensaje de error (si existe) */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative text-center mt-[30px] mb-[5px]"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Botón de envío */}
        <button
          type="submit"
          className="mt-[20px] w-full bg-emerald-700 text-white py-2 rounded-md hover:bg-emerald-800 transition-colors text-sm"
        >
          Entrar al Sistema
        </button>

        {/* Enlace a la página de registro */}
        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">¿No tienes una cuenta?</span>{" "}
          <Link
            to="/auth/register"
            className="text-emerald-700 hover:underline"
          >
            Solicitar Acceso
          </Link>
        </div>
      </form>
    </div>
  );
}
