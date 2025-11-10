/**
 * @file useTechnicalAnalysisForm.js
 * @module hooks/requirements
 * @description Hook para manejar la lógica, estado, validación (Yup) y el envío (Formik)
 * del formulario de Análisis Técnico de TI.
 */
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import api from "../../config/axios.js";

// --- ESQUEMA DE VALIDACIÓN YUP DEFINIDO EN EL HOOK ---
/**
 * @const {object} TechnicalAnalysisSchema
 * @description Esquema de validación Yup para el formulario de Análisis Técnico de TI.
 */
const TechnicalAnalysisSchema = Yup.object().shape({
  descripcion_solucion: Yup.string()
    .min(10, "La descripción debe tener al menos 10 caracteres.")
    .max(500, "La descripción no puede exceder los 500 caracteres.")
    .required("La descripción de la solución es obligatoria."),

  cantidad_equipos: Yup.number()
    .min(0, "La cantidad de equipos no puede ser negativa.")
    .integer("Debe ser un número entero.")
    .required("La cantidad de equipos es obligatoria."),

  cantidad_perifericos: Yup.number()
    .min(0, "La cantidad de periféricos no puede ser negativa.")
    .integer("Debe ser un número entero.")
    .required("La cantidad de periféricos es obligatoria."),

  presupuesto_final: Yup.number()
    .min(100, "El presupuesto debe ser mayor a 100 COP.")
    .integer("Debe ser un valor entero (sin decimales).")
    .required("El presupuesto final es obligatorio."),
});

// ----------------------------------------------------

/**
 * @function useTechnicalAnalysisForm
 * @description Hook personalizado que encapsula la lógica de Formik para el formulario de Análisis Técnico.
 * @param {object} requerimiento - El objeto del requerimiento actual.
 * @param {Function} onClose - Función para cerrar la vista/modal.
 * @param {Function} onSuccess - Función a ejecutar tras el envío exitoso.
 * @returns {object} La instancia completa de Formik (`formik`) para ser usada en el componente.
 */
export const useTechnicalAnalysisForm = (requerimiento, onClose, onSuccess) => {
  const initialAnalysis = requerimiento.TechnicalAnalysis || {};

  const formik = useFormik({
    initialValues: {
      descripcion_solucion: initialAnalysis.descripcion_solucion || "",
      cantidad_equipos: initialAnalysis.cantidad_equipos || 0,
      cantidad_perifericos: initialAnalysis.cantidad_perifericos || 0,
      presupuesto_final: initialAnalysis.presupuesto_final || 0,
    },
    validationSchema: TechnicalAnalysisSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const payload = {
          ...values,
          id_requerimiento: requerimiento.id_requerimiento,
        };

        const response = await api.patch(
          `/api/requerimientos/${requerimiento.id_requerimiento}/ti-analysis`,
          payload
        );

        const updatedRequirement = response.data;

        toast.success("✅ Análisis Técnico guardado y requerimiento avanzado.");

        onSuccess(updatedRequirement);
        onClose();
      } catch (err) {
        // Manejo de errores de la API y Formik
        const errorMessage =
          err.response?.data?.message ||
          "Error al guardar el análisis. Inténtalo de nuevo.";

        setFieldError("apiError", errorMessage);
        toast.error(`❌ ${errorMessage}`);
        console.error("Error al guardar análisis TI:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return formik;
};
