/**
 * @file CreateRequirementForm.jsx
 * @module Components/Requirements
 * @description Formulario inicial para la creación de un nuevo requerimiento. Permite al usuario
 * (Encargado) ingresar un asunto y la descripción detallada de la necesidad.
 * @requires ../../hooks/requirements/useCreateRequirementForm.js
 */
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import useCreateRequirementForm from "../../hooks/requirements/useCreateRequirementForm.js";

/**
 * @function CreateRequirementForm
 * @description Muestra el formulario inicial para que un Encargado describa un requerimiento.
 * Este componente está diseñado para ser renderizado dentro de un modal o contenedor.
 * @param {object} props - Propiedades del componente.
 * @param {Function} props.onClose - Función para cerrar el contenedor (modal).
 * @param {Function} props.onSuccess - Función a ejecutar tras la creación exitosa.
 * @returns {JSX.Element}
 */
export default function CreateRequirementForm({ onClose, onSuccess }) {
  const { handleSubmit, isSubmitting, initialValues, validationSchema } =
    useCreateRequirementForm(onSuccess);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-secondary rounded-lg shadow-xl w-full max-w-xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 flex justify-between items-center border-b border-gray-200">
          <h3 className="text-xl font-bold text-primary">
            Iniciar Nuevo Requerimiento
          </h3>
          <button onClick={onClose} className="text-text-main hover:opacity-70">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </header>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="p-6">
              {/* Campo Asunto */}
              <div className="mb-4">
                <label
                  htmlFor="asunto"
                  className="block text-text-main font-semibold mb-1"
                >
                  Asunto (Resumen Corto):
                </label>
                <Field
                  id="asunto"
                  name="asunto"
                  type="text"
                  autoComplete="off"
                  className={`w-full p-2 border rounded-lg focus:ring-1 outline-none ${
                    errors.asunto && touched.asunto
                      ? "border-error focus:ring-error"
                      : "border-gray-300 focus:ring-primary"
                  }`}
                  placeholder="Ej. Solicitud de 5 equipos para nuevo personal."
                />
                <ErrorMessage
                  name="asunto"
                  component="div"
                  className="text-error text-sm mt-1"
                />
              </div>

              {/* Campo Descripción */}
              <div className="mb-6">
                <label
                  htmlFor="detalle_necesidad"
                  className="block text-text-main font-semibold mb-1"
                >
                  Descripción detallada de la necesidad:
                </label>
                <Field
                  id="detalle_necesidad"
                  name="detalle_necesidad"
                  as="textarea"
                  rows="5"
                  className={`w-full p-2 border rounded-lg focus:ring-1 outline-none resize-y ${
                    errors.detalle_necesidad && touched.detalle_necesidad
                      ? "border-error focus:ring-error"
                      : "border-gray-300 focus:ring-primary"
                  }`}
                  placeholder="Detalla qué se necesita, por qué y para qué."
                />
                <ErrorMessage
                  name="detalle_necesidad"
                  component="div"
                  className="text-error text-sm mt-1"
                />
              </div>

              {/* Botón de Envío */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`py-2 px-6 rounded-lg text-white font-bold flex items-center gap-2 transition-colors ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary hover:bg-primary-dark"
                  }`}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                  {isSubmitting ? "Enviando..." : "Enviar a Análisis TI"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
