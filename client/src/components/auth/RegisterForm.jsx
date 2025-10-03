/**
 * @file RegisterForm.jsx
 * @module RegisterForm
 * @description Componente funcional que renderiza el formulario de registro de nuevos usuarios.
 * Aplica la paleta de colores de seguridad (Verde Oliva/Esmeralda) y usa useNavigate para la navegación.
 * @component
 * @requires react-router-dom/Link, useNavigate
 * @requires ../../hooks/useRegisterForm
 * @requires ../../hooks/utils/usePasswordToggle
 * @requires @fortawesome/react-fontawesome
 * @requires @fortawesome/free-solid-svg-icons (faSignOutAlt)
 */
import { Link, useNavigate } from "react-router-dom";
import { useRegisterForm } from "../../hooks/auth/useRegisterForm.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { usePasswordToggle } from "../../hooks/utils/usePasswordToggle.js";

/**
 * @function RegisterForm
 * @description Renderiza el formulario de registro, solicitando el nombre, apellido, correo y contraseña
 * para crear una nueva cuenta de usuario.
 *
 * @returns {JSX.Element} El elemento JSX que representa el formulario de registro.
 */
export default function RegisterForm() {
  // 💡 Hook de navegación para reemplazar useGoBackHome
  const navigate = useNavigate();
  const goBack = () => navigate(-1); // Volver a la página anterior

  // Hook para alternar la visibilidad de la contraseña
  const [inputType, Icon, toggleVisibility] = usePasswordToggle();

  // Hook principal que provee el estado, los manejadores de eventos y la función de registro
  const {
    nombre,
    correo,
    password,
    apellido,
    handleRegister,
    handleClickNombre,
    handleClickCorreo,
    handleClickApellido,
    handleClickPassword,
    error,
    handleKeyTextDown,
  } = useRegisterForm();

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
        <FontAwesomeIcon icon={faSignOutAlt} className="text-xl sm:text-xl" />
        <span className="text-xs sm:text-sm mt-1">Volver</span>
      </button>

      <form
        // 💡 Sombra gris carbón para coherencia
        className="bg-white p-6 rounded-lg shadow-xl shadow-gray-700 w-[90%] h-[95%] max-w-sm mt-[100px] md:mt-[40px] mb-5 sm:w-full sm:mt-[30px]"
        onSubmit={handleRegister}
      >
        {/* Título: Usa color oscuro/carbón */}
        <h2 className="text-2xl font-bold mb-[10px] text-center text-gray-800">
          Solicitud de Acceso
        </h2>

        {/* Fieldset: Información personal */}
        <fieldset className="p-4 rounded-md mb-[20px] border border-gray-400 shadow-lg shadow-gray-400">
          <legend className="px-2 text-md font-semibold bg-white text-emerald-700">
            Información personal
          </legend>
          <div className="space-y-4">
            {/* Input Nombre */}
            <label className="block">
              <span className="text-gray-700 text-md">Nombre:</span>
              <input
                name="nombre"
                type="text"
                onKeyDown={handleKeyTextDown}
                value={nombre}
                onChange={handleClickNombre}
                // 💡 Focus y Hover: Esmeralda
                className="mt-1 block w-full rounded-md font-semibold border-2 p-[5px] outline-0 border-gray-400 bg-gray-50 shadow-lg focus:border-emerald-700 focus:ring-2 focus:ring-emerald-300 transition-all duration-200 ease-in-out hover:border-emerald-500"
                autoComplete="off"
                required
              />
            </label>

            {/* Input Apellido */}
            <label className="block">
              <span className="text-gray-700 text-md">Apellido:</span>
              <input
                name="apellido"
                type="text"
                onKeyDown={handleKeyTextDown}
                value={apellido}
                onChange={handleClickApellido}
                // 💡 Focus y Hover: Esmeralda
                className="mt-1 block w-full rounded-md font-semibold border-2 p-[5px] outline-0 border-gray-400 bg-gray-50 shadow-lg focus:border-emerald-700 focus:ring-2 focus:ring-emerald-300 transition-all duration-200 ease-in-out hover:border-emerald-500"
                autoComplete="off"
                required
              />
            </label>
          </div>
        </fieldset>

        {/* Fieldset: Datos de la cuenta */}
        <fieldset className="p-4 rounded-md mb-3 border border-gray-400 shadow-lg shadow-gray-400">
          <legend className="px-2 text-md font-semibold bg-white text-emerald-700">
            Datos de la cuenta
          </legend>
          <div className="space-y-4">
            {/* Input Correo Electrónico */}
            <label className="block">
              <span className="text-gray-700 text-md">Correo electrónico:</span>
              <input
                name="correo"
                type="email"
                value={correo}
                onChange={handleClickCorreo}
                // 💡 Focus y Hover: Esmeralda
                className="mt-1 block w-full rounded-md font-semibold border-2 p-[5px] outline-0 border-gray-400 bg-gray-50 shadow-lg focus:border-emerald-700 focus:ring-2 focus:ring-emerald-300 transition-all duration-200 ease-in-out hover:border-emerald-500"
                autoComplete="off"
                required
              />
            </label>

            {/* Input Contraseña con alternador de visibilidad */}
            <label className="block relative">
              <span className="text-gray-700 text-md">Contraseña:</span>
              <input
                name="password"
                type={inputType}
                value={password}
                onChange={handleClickPassword}
                // 💡 Focus y Hover: Esmeralda
                className="mt-1 block w-full rounded-md font-semibold p-[5px] outline-0 border-2 border-gray-400 bg-gray-50 shadow-lg focus:border-emerald-700 focus:ring-2 focus:ring-emerald-300 transition-all duration-200 ease-in-out hover:border-emerald-500 pr-10"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={toggleVisibility}
                className="absolute inset-y-0 right-[-8px] top-7 flex items-center pr-3 text-gray-400 outline-none"
              >
                <Icon />
              </button>
            </label>
          </div>
        </fieldset>

        {/* Mensaje de error (si existe) */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative text-center mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Botón de envío (Color Principal: Esmeralda) */}
        <button
          type="submit"
          className="mt-4 w-full bg-emerald-700 text-white py-2 rounded-md hover:bg-emerald-800 transition-colors text-sm"
        >
          Registrarse
        </button>

        {/* Enlace a la página de inicio de sesión */}
        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">¿Ya tienes una cuenta?</span>{" "}
          <Link to="/auth/login" className="text-emerald-700 hover:underline">
            Inicia sesión
          </Link>
        </div>
      </form>
    </div>
  );
}
