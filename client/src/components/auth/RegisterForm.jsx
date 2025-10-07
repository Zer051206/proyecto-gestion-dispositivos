/**
 * @file RegisterForm.jsx
 * @module RegisterForm
 * @description Componente funcional que renderiza el formulario de registro de nuevos usuarios.
 * Utiliza la paleta de seguridad (Verde Esmeralda) y `useNavigate` para la navegación.
 * @component
 * @requires react-router-dom/Link
 * @requires ../../hooks/auth/useRegisterForm
 * @requires ../../hooks/utils/usePasswordToggle
 * @requires @fortawesome/react-fontawesome
 * @requires @fortawesome/free-solid-svg-icons (faSignOutAlt)
 */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterForm } from "../../hooks/auth/useRegisterForm.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { usePasswordToggle } from "../../hooks/utils/usePasswordToggle.js";

export default function RegisterForm() {
  const navigate = useNavigate();
  // Función goBack que navega a la raíz
  const goBack = () => navigate("/");

  // Hook para la visibilidad de la contraseña
  const [
    inputType,
    Icon,
    toggleVisibility,
    inputTypeConfirm,
    IconConfirm,
    toggleVisibilityConfirm,
  ] = usePasswordToggle();

  // Hook principal que provee el estado y las funciones de Formik
  const {
    formik,
    tiposIdentificacion,
    isLoading,
    error,
    handleKeyNumberDown,
    handleKeyTextDown,
  } = useRegisterForm();

  // Clase de Tailwind para el estilo de los inputs (copiada del LoginForm)
  const inputClasses =
    "mt-3 mb-2 block w-full rounded-md font-semibold border-2 border-accent/60 p-2 outline-0 bg-secondary focus:ring-1 focus:ring-accent transition-all duration-200 outline-none";

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen bg-background p-4">
      {/* Botón de navegación para volver a la página principal */}
      <button
        type="button"
        onClick={goBack}
        // Clases de estilo del botón Volver (Se usa el color de alerta rojo)
        className="absolute top-1 right-2 outline-none bg-red-600 hover:bg-red-700 text-text-light font-bold p-2 rounded-lg flex flex-col items-center justify-center transition-colors duration-300 w-20 h-20 shadow-lg"
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="text-2xl" />
        <span className="text-sm mt-1">Volver</span>
      </button>

      <form
        // Fondo y sombra del formulario (Gris Carbón)
        className="bg-secondary mt-[90px] mb-[40px] p-5 rounded-lg shadow-xl shadow-black w-[95%] md:w-full max-w-2xl my-8"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        {/* Título */}
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Solicitud de Acceso
        </h2>

        {/* --- DATOS PERSONALES --- */}
        <fieldset className="p-4 rounded-md mb-6 border border-gray-400 shadow-lg shadow-gray-400">
          <legend className={`px-2 text-lg font-semibold bg-secondary`}>
            Información Personal
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Input Nombre */}
            <label className="block">
              <span className="text-text-main font-semibold">Nombre:</span>
              <input
                type="text"
                onKeyDown={handleKeyTextDown}
                autoComplete="off"
                className={`${inputClasses}`}
                {...formik.getFieldProps("nombre")}
              />
              {formik.touched.nombre && formik.errors.nombre ? (
                <div className="text-error text-sm mt-1">
                  {formik.errors.nombre}
                </div>
              ) : null}
            </label>

            {/* Input Apellido */}
            <label className="block">
              <span className="text-text-main font-semibold">Apellido:</span>
              <input
                type="text"
                onKeyDown={handleKeyTextDown}
                autoComplete="off"
                className={`${inputClasses}`}
                {...formik.getFieldProps("apellido")}
              />
              {formik.touched.apellido && formik.errors.apellido ? (
                <div className="text-error text-sm mt-1">
                  {formik.errors.apellido}
                </div>
              ) : null}
            </label>

            {/* Select Tipo de Identificación */}
            <label className="block">
              <span className="text-text-main font-semibold">
                Tipo de Identificación:
              </span>
              <select
                className={`${inputClasses} `}
                {...formik.getFieldProps("id_tipo_identificacion")}
              >
                <option value="" className="hidden">
                  Selecciona una opción...
                </option>
                {/* Asumo que tiposIdentificacion tiene { id, nombre } o {id_tipo_identificacion, tipo_identificacion} */}
                {tiposIdentificacion &&
                  tiposIdentificacion.map((tipo) => (
                    <option
                      key={tipo.id_tipo_identificacion || tipo.id}
                      value={tipo.id_tipo_identificacion || tipo.id}
                    >
                      {tipo.tipo_identificacion || tipo.nombre}
                    </option>
                  ))}
              </select>
              {formik.touched.id_tipo_identificacion &&
              formik.errors.id_tipo_identificacion ? (
                <div className="text-error text-sm mt-1">
                  {formik.errors.id_tipo_identificacion}
                </div>
              ) : null}
            </label>

            {/* Input Identificación */}
            <label className="block">
              <span className="text-text-main font-semibold">
                Identificación:
              </span>
              <input
                type="number"
                onKeyDown={handleKeyNumberDown}
                autoComplete="off"
                className={`${inputClasses} `}
                {...formik.getFieldProps("identificacion")}
              />
              {formik.touched.identificacion && formik.errors.identificacion ? (
                <div className="text-error text-sm mt-1">
                  {formik.errors.identificacion}
                </div>
              ) : null}
            </label>

            {/* Input Teléfono (ocupa 2 columnas en pantallas medianas) */}
            <label className="block md:col-span-2">
              <span className="text-text-main font-semibold">Teléfono:</span>
              <input
                type="number"
                onKeyDown={handleKeyNumberDown}
                autoComplete="off"
                className={`${inputClasses} md:justify-items-center`}
                {...formik.getFieldProps("telefono")}
              />
              {formik.touched.telefono && formik.errors.telefono ? (
                <div className="text-error text-sm mt-1">
                  {formik.errors.telefono}
                </div>
              ) : null}
            </label>
          </div>
        </fieldset>

        {/* --- DATOS DE LA CUENTA --- */}
        <fieldset className="p-4 rounded-md mb-6 border border-gray-400 shadow-lg shadow-gray-400">
          <legend className={`px-2 text-lg font-semibold bg-secondary`}>
            Credenciales de Acceso
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Input Correo Electrónico */}
            <label className="block md:col-span-2">
              <span className="text-text-main font-semibold">
                Correo electrónico:
              </span>
              <input
                type="email"
                autoComplete="off"
                className={`${inputClasses} md:justify-items-center`}
                {...formik.getFieldProps("correo")}
              />
              {formik.touched.correo && formik.errors.correo ? (
                <div className="text-error text-sm mt-1">
                  {formik.errors.correo}
                </div>
              ) : null}
            </label>

            {/* Input Contraseña */}
            <div className="relative">
              <label className="block">
                <span className="text-text-main font-semibold">
                  Contraseña:
                </span>
                <input
                  type={inputType}
                  autoComplete="off"
                  className={`${inputClasses}  pr-10`}
                  {...formik.getFieldProps("password")}
                />
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="absolute right-0 top-[50px] flex items-center pr-3 text-gray-500 outline-none"
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

            {/* Input Confirmar Contraseña (si es necesario por el esquema) */}
            {/* Nota: Asumo que confirmPassword es un campo de Formik, aunque no estaba en el esquema Zod final */}
            <div className="relative">
              <label className="block">
                <span className="text-text-main font-semibold">
                  Confirmar Contraseña:
                </span>
                <input
                  type={inputTypeConfirm}
                  autoComplete="off"
                  className={`${inputClasses}  pr-10`}
                  {...formik.getFieldProps("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={toggleVisibilityConfirm}
                  className="absolute right-0 top-[50px] flex items-center pr-3 text-gray-500 outline-none"
                >
                  <IconConfirm />
                </button>
                {formik.touched.confirmPassword &&
                formik.errors.confirmPassword ? (
                  <div className="text-error text-sm mt-1">
                    {formik.errors.confirmPassword}
                  </div>
                ) : null}
              </label>
            </div>
          </div>
        </fieldset>

        {/* Mensaje de error de API */}
        {formik.errors.apiError && (
          <div
            className="mt-4 bg-red-100 border-error text-error px-4 py-3 rounded-md"
            role="alert"
          >
            <span>{formik.errors.apiError}</span>
          </div>
        )}

        {/* Botón de envío (Color Principal: Verde Esmeralda) */}
        <button
          type="submit"
          disabled={formik.isSubmitting || isLoading}
          className="mt-6 w-full bg-primary text-secondary font-bold py-3 px-4 rounded-md hover:opacity-90 transition-opacity disabled:bg-primary/50 disabled:cursor-not-allowed"
        >
          {formik.isSubmitting ? "Enviando Solicitud..." : "Solicitar Registro"}
        </button>

        {/* Enlace a la página de inicio de sesión */}
        <div className="mt-6 text-center">
          <span className="text-text-main">¿Ya tienes una cuenta?</span>{" "}
          <Link
            to="/auth/login"
            className="text-primary hover:underline font-semibold"
          >
            Inicia sesión
          </Link>
        </div>
      </form>
    </div>
  );
}
