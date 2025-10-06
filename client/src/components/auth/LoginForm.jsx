// src/components/auth/LoginForm.jsx (Paleta 1: Profesional)
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginForm } from "../../hooks/auth/useLoginForm.js";
import { usePasswordToggle } from "../../hooks/utils/usePasswordToggle.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

export default function LoginForm() {
  const navigate = useNavigate();
  const goBack = () => navigate("/");
  const [inputType, Icon, toggleVisibility] = usePasswordToggle();
  const formik = useLoginForm();

  const inputClasses =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50";

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen bg-background p-4">
      <button
        type="button"
        onClick={goBack}
        className="absolute top-4 right-4 bg-error hover:bg-red-700 text-white font-bold p-2 rounded-lg flex flex-col items-center justify-center transition-colors duration-300 w-20 h-20 shadow-lg"
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="text-2xl" />
        <span className="text-sm mt-1">Volver</span>
      </button>

      <form
        onSubmit={formik.handleSubmit}
        className="bg-secondary p-8 rounded-lg shadow-xl w-full max-w-sm"
        noValidate
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-text-main">
          Acceso de Seguridad
        </h2>
        <fieldset className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Correo electrónico:</span>
            <input
              type="email"
              className={inputClasses}
              {...formik.getFieldProps("correo")}
            />
            {formik.touched.correo && formik.errors.correo ? (
              <div className="text-error text-sm mt-1">
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
              <div className="text-error text-sm mt-1">
                {formik.errors.password}
              </div>
            ) : null}
          </label>
        </fieldset>

        {formik.errors.apiError && (
          <div
            className="mt-4 bg-red-100 border-error text-error px-4 py-3 rounded-md"
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

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">¿No tienes una cuenta?</span>{" "}
          <Link
            to="/auth/register"
            className="text-primary hover:underline font-semibold"
          >
            Solicitar Acceso
          </Link>
        </div>
      </form>
    </div>
  );
}
