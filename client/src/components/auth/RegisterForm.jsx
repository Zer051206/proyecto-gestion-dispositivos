// src/components/auth/RegisterForm.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterForm } from "../../hooks/auth/useRegisterForm.js";
import { usePasswordToggle } from "../../hooks/utils/usePasswordToggle.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

export default function RegisterForm() {
  const navigate = useNavigate();
  const goBack = () => navigate("/");
  const [inputType, Icon, toggleVisibility] = usePasswordToggle();

  const { formik, tiposIdentificacion, isLoading, error } = useRegisterForm();

  const inputClasses =
    "mt-1 block w-full rounded-md font-semibold border-2 p-[5px] outline-0 border-gray-400 bg-gray-50 shadow-lg focus:border-emerald-700 focus:ring-2 focus:ring-emerald-300 transition-all duration-200 ease-in-out hover:border-emerald-500";

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen p-4">
      <button
        type="button"
        onClick={goBack}
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded-lg flex flex-col items-center justify-center transition-colors duration-300 w-20 h-20"
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="text-2xl" />
        <span className="text-sm mt-1">Volver</span>
      </button>

      <form
        // Ancho responsivo: 95% en móvil, pero con un máximo para pantallas grandes.
        className="bg-white p-6 rounded-lg shadow-xl shadow-gray-700 w-[95%] md:w-full max-w-2xl my-8"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Solicitud de Acceso
        </h2>

        {/* --- DATOS PERSONALES --- */}
        <fieldset className="p-4 rounded-md mb-6 border border-gray-400">
          <legend className="px-2 text-lg font-semibold bg-white text-emerald-700">
            Información Personal
          </legend>
          {/* Grid responsivo: 1 columna en móvil, 2 columnas en tablets y más grandes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <label className="block">
              <span className="text-gray-700">Nombre:</span>
              <input
                type="text"
                className={inputClasses}
                {...formik.getFieldProps("nombre")}
              />
              {formik.touched.nombre && formik.errors.nombre ? (
                <div className="text-red-600 text-sm mt-1">
                  {formik.errors.nombre}
                </div>
              ) : null}
            </label>
            <label className="block">
              <span className="text-gray-700">Apellido:</span>
              <input
                type="text"
                className={inputClasses}
                {...formik.getFieldProps("apellido")}
              />
              {formik.touched.apellido && formik.errors.apellido ? (
                <div className="text-red-600 text-sm mt-1">
                  {formik.errors.apellido}
                </div>
              ) : null}
            </label>
            <label className="block">
              <span className="text-gray-700">Tipo de Identificación:</span>
              <select
                className={inputClasses}
                {...formik.getFieldProps("id_tipo_identificacion")}
              >
                <option value="">Selecciona una opción...</option>
                {tiposIdentificacion.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
              {formik.touched.id_tipo_identificacion &&
              formik.errors.id_tipo_identificacion ? (
                <div className="text-red-600 text-sm mt-1">
                  {formik.errors.id_tipo_identificacion}
                </div>
              ) : null}
            </label>
            <label className="block">
              <span className="text-gray-700">Identificación:</span>
              <input
                type="text"
                className={inputClasses}
                {...formik.getFieldProps("identificacion")}
              />
              {formik.touched.identificacion && formik.errors.identificacion ? (
                <div className="text-red-600 text-sm mt-1">
                  {formik.errors.identificacion}
                </div>
              ) : null}
            </label>
            <label className="block md:col-span-2">
              {" "}
              {/* Ocupa 2 columnas en pantallas medianas */}
              <span className="text-gray-700">Teléfono:</span>
              <input
                type="tel"
                className={inputClasses}
                {...formik.getFieldProps("telefono")}
              />
              {formik.touched.telefono && formik.errors.telefono ? (
                <div className="text-red-600 text-sm mt-1">
                  {formik.errors.telefono}
                </div>
              ) : null}
            </label>
          </div>
        </fieldset>

        {/* --- DATOS DE LA CUENTA --- */}
        <fieldset className="p-4 rounded-md mb-6 border border-gray-400">
          <legend className="px-2 text-lg font-semibold bg-white text-emerald-700">
            Datos de la Cuenta
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <label className="block md:col-span-2">
              <span className="text-gray-700">Correo electrónico:</span>
              <input
                type="email"
                className={inputClasses}
                {...formik.getFieldProps("correo")}
              />
              {formik.touched.correo && formik.errors.correo ? (
                <div className="text-red-600 text-sm mt-1">
                  {formik.errors.correo}
                </div>
              ) : null}
            </label>
            <label className="block relative">
              <span className="text-gray-700">Contraseña:</span>
              <input
                type={inputType}
                className={`${inputClasses} pr-10`}
                {...formik.getFieldProps("password")}
              />
              <button
                type="button"
                onClick={toggleVisibility}
                className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-gray-500"
              >
                <Icon />
              </button>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-600 text-sm mt-1">
                  {formik.errors.password}
                </div>
              ) : null}
            </label>
            <label className="block relative">
              <span className="text-gray-700">Confirmar Contraseña:</span>
              <input
                type={inputType}
                className={`${inputClasses} pr-10`}
                {...formik.getFieldProps("confirmPassword")}
              />
              <button
                type="button"
                onClick={toggleVisibility}
                className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-gray-500"
              >
                <Icon />
              </button>
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="text-red-600 text-sm mt-1">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
            </label>
          </div>
        </fieldset>

        {formik.errors.apiError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md ..."
            role="alert"
          >
            <span>{formik.errors.apiError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="mt-4 w-full bg-emerald-700 text-white font-bold py-3 rounded-md hover:bg-emerald-800 transition-colors disabled:bg-emerald-400"
        >
          {formik.isSubmitting ? "Enviando Solicitud..." : "Solicitar Registro"}
        </button>

        <div className="mt-6 text-center">
          <span className="text-gray-600">¿Ya tienes una cuenta?</span>{" "}
          <Link
            to="/auth/login"
            className="text-emerald-700 hover:underline font-semibold"
          >
            Inicia sesión
          </Link>
        </div>
      </form>
    </div>
  );
}
