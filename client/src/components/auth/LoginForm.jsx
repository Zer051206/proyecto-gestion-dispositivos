/**
 * @file LoginForm.jsx
 * @module Components/Auth
 * @description Componente de React que renderiza el formulario de inicio de sesión para la aplicación.
 * Se encarga de la presentación visual del formulario, mientras delega toda la lógica de estado,
 * validación y envío al hook `useLoginForm`.
 * @requires react
 * @requires react-router-dom
 * @requires @fortawesome/react-fontawesome
 * @requires ../../hooks/auth/useLoginForm.js
 * @requires ../../hooks/utils/usePasswordToggle.js
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLoginForm } from "../../hooks/auth/useLoginForm.js";
import { usePasswordToggle } from "../../hooks/utils/usePasswordToggle.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

/**
 * @function LoginForm
 * @description Renderiza la interfaz de usuario para el inicio de sesión. Utiliza `useLoginForm`
 * para manejar el estado y la lógica del formulario, y `usePasswordToggle` para la funcionalidad
 * de mostrar/ocultar contraseña. Muestra los errores de validación y los errores de la API.
 * @returns {JSX.Element} El componente del formulario de login.
 */
export default function LoginForm() {
  const navigate = useNavigate();

  /**
   * @function goBack
   * @description Navega al usuario a la página de inicio.
   */
  const goBack = () => navigate("/");

  // Hook para gestionar la visibilidad del campo de contraseña.
  const [inputType, Icon, toggleVisibility] = usePasswordToggle();

  // Hook que encapsula toda la lógica de Formik para el formulario.
  const formik = useLoginForm();

  /**
   * @const {string} inputClasses
   * @description Clases de Tailwind CSS reutilizables para los campos de entrada del formulario.
   */
  const inputClasses =
    "mt-2 block w-full rounded-md font-semibold border-2 border-gray-300 p-2 outline-none bg-gray-50 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200";

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen bg-background p-4">
      <button
        type="button"
        onClick={goBack}
        className="absolute top-1 right-2 bg-red-600 outline-none hover:bg-red-700 text-text-light font-bold p-2 rounded-lg flex flex-col items-center justify-center transition-colors duration-300 w-20 h-20 shadow-lg"
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="text-2xl" />
        <span className="text-sm mt-1">Volver</span>
      </button>

      <form
        onSubmit={formik.handleSubmit}
        className="bg-secondary p-8 rounded-lg shadow-lg mt-[80px] mb-[50px] md:mt-[40px] shadow-black w-full max-w-sm border-2 border-primary"
        noValidate
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-text-main">
          Acceso de Seguridad
        </h2>
        <fieldset className="space-y-4">
          <label className="block">
            <span className="text-text-main font-semibold">
              Correo electrónico:
            </span>
            <input
              type="email"
              autoComplete="off"
              className={inputClasses}
              {...formik.getFieldProps("correo")}
            />
            {formik.touched.correo && formik.errors.correo ? (
              <div className="text-error text-sm mt-1">
                {formik.errors.correo}
              </div>
            ) : null}
          </label>
          <div className="relative">
            <label className="block">
              <span className="text-text-main font-semibold">Contraseña:</span>
              <input
                type={inputType}
                autoComplete="current-password"
                className={`${inputClasses} pr-10`}
                {...formik.getFieldProps("password")}
              />
              <button
                type="button"
                onClick={toggleVisibility}
                className="absolute right-0 top-[45px] flex items-center pr-3 text-gray-400 outline-none"
              >
                <Icon />
              </button>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-error text-sm mt-1">
                  {formik.errors.password}
                </div>
              ) : null}
            </label>
          </div>
        </fieldset>

        {/* Contenedor para mostrar errores generales de la API */}
        {formik.errors.apiError && (
          <div
            className="mt-4 bg-accent/10 border-accent text-accent px-4 py-3 rounded-md"
            role="alert"
          >
            <span>{formik.errors.apiError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="mt-6 w-full bg-primary text-text-light font-bold py-3 px-4 rounded-md hover:opacity-90 transition-opacity disabled:bg-primary/50 disabled:cursor-not-allowed"
        >
          {formik.isSubmitting ? "Entrando..." : "Entrar al Sistema"}
        </button>

        <div className="mt-3 text-center text-sm"></div>
      </form>
    </div>
  );
}
