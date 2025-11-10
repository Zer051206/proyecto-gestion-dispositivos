/**
 * @file TechnicalAnalysisModal.jsx
 * @module Components/Requirements
 * @description Modal para que el equipo de TI documente el análisis técnico, incluyendo
 * la solución propuesta, la cantidad de activos necesarios y el presupuesto.
 */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faLaptop,
  faMouse,
  faDollarSign,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { useTechnicalAnalysisForm } from "../../hooks/requirements/useTechnicalAnalysisForm.js";
import { handleKeyNumberDown } from "../../utils/inputUtilities.js";

/**
 * @function TechnicalAnalysisModal
 * @description Componente modal para la gestión del Análisis Técnico.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.requerimiento - El objeto completo del requerimiento a analizar.
 * @param {Function} props.onClose - Callback para cerrar el modal.
 * @param {Function} props.onSuccess - Callback a ejecutar tras un envío exitoso.
 * @returns {JSX.Element}
 */
export default function TechnicalAnalysisModal({
  requerimiento,
  onClose,
  onSuccess,
}) {
  const formik = useTechnicalAnalysisForm(requerimiento, onClose, onSuccess);
  const isEditing = requerimiento.TechnicalAnalysis; // Determina si es edición o primer análisis

  const inputClasses =
    "mt-1 block w-full rounded-md font-semibold border-2 border-gray-300 p-2 outline-none bg-gray-50 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200";

  const renderError = (field) => {
    return formik.touched[field] && formik.errors[field] ? (
      <div className="text-error text-sm mt-1">{formik.errors[field]}</div>
    ) : null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 overflow-y-auto animate-fade-in">
      {/* Contenedor principal del modal */}
      <div className="bg-secondary rounded-lg shadow-xl w-full max-w-3xl flex flex-col my-2">
        {/* HEADER */}
        <header className="p-4 flex justify-between items-center border-b border-gray-200 bg-secondary z-10">
          <h2 className="text-2xl font-bold text-primary">
            Análisis Técnico: {requerimiento.codigo_requerimiento}
          </h2>
          <button
            onClick={onClose}
            className="text-text-main hover:opacity-70"
            title="Cerrar"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </header>

        {/* BODY (Formulario) */}
        <form
          onSubmit={formik.handleSubmit}
          noValidate
          className="p-6 space-y-6"
        >
          <div className="bg-info/10 border-l-4 border-info text-info-dark p-3 rounded-md">
            <p className="font-semibold">
              Documenta la solución técnica propuesta y define los recursos
              (Equipos/Periféricos) y el presupuesto.
            </p>
          </div>

          {/* Campo: Descripción de la Solución Técnica */}
          <label className="block">
            <span className="text-text-main font-semibold flex items-center gap-2">
              <FontAwesomeIcon icon={faWrench} className="text-primary" />{" "}
              Descripción de la Solución Técnica *
            </span>
            <textarea
              rows="4"
              placeholder="Detalle la solución propuesta, especificaciones mínimas y justificación."
              className={inputClasses}
              {...formik.getFieldProps("descripcion_solucion")}
            ></textarea>
            {renderError("descripcion_solucion")}
          </label>

          {/* Agrupación de Recursos y Presupuesto */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-gray-200">
            {/* Campo: Cantidad de Equipos */}
            <label className="block">
              <span className="text-text-main font-semibold flex items-center gap-2 my-4">
                <FontAwesomeIcon
                  icon={faLaptop}
                  className="text-neutral-dark"
                />{" "}
                Cantidad de Equipos *
              </span>
              <input
                type="number"
                min="0"
                autoComplete="off"
                onKeyDown={handleKeyNumberDown}
                className={inputClasses}
                {...formik.getFieldProps("cantidad_equipos")}
              />
              {renderError("cantidad_equipos")}
            </label>

            {/* Campo: Cantidad de Periféricos */}
            <label className="block">
              <span className="text-text-main font-semibold flex items-center gap-2 my-4">
                <FontAwesomeIcon icon={faMouse} className="text-neutral-dark" />{" "}
                Cantidad de Periféricos *
              </span>
              <input
                type="number"
                min="0"
                autoComplete="off"
                onKeyDown={handleKeyNumberDown}
                className={inputClasses}
                {...formik.getFieldProps("cantidad_perifericos")}
              />
              {renderError("cantidad_perifericos")}
            </label>

            {/* Campo: Presupuesto Final Estimado */}
            <label className="block">
              <span className="text-text-main font-semibold flex items-center gap-2 my-1">
                <FontAwesomeIcon icon={faDollarSign} className="text-success" />{" "}
                Presupuesto Final Estimado (COP) *
              </span>
              <input
                type="number"
                min="100"
                autoComplete="off"
                onKeyDown={handleKeyNumberDown}
                className={inputClasses}
                {...formik.getFieldProps("presupuesto_final")}
              />
              {renderError("presupuesto_final")}
              <p className="text-xs text-gray-500 mt-1">
                Valor actual: $
                {formik.values.presupuesto_final.toLocaleString("es-CO")}
              </p>
            </label>
          </div>

          {/* FOOTER - Botones de acción */}
          <footer className="flex justify-end items-center gap-4 pt-4 border-t border-gray-200">
            {formik.errors.apiError && (
              <div className="text-error text-sm mr-auto font-semibold">
                {formik.errors.apiError}
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={formik.isSubmitting}
              className="py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-text-main font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="py-2 px-4 rounded-lg bg-primary text-text-light font-bold hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting
                ? "Guardando..."
                : isEditing
                ? "Actualizar Análisis"
                : "Avanzar Requerimiento"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
