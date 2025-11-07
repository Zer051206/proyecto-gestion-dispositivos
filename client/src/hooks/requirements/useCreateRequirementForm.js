/**
 * @file useCreateRequirementForm.js
 * @module hooks/requirements
 * @description Hook de React para gestionar la lógica del formulario de inicio de requerimientos.
 * Se encarga de la validación de datos con Yup y el envío de los datos a la API.
 * @requires formik
 * @requires yup
 * @requires ../../config/axios.js
 */
import { useState } from "react";
import * as Yup from "yup";
import api from "../../config/axios.js";
import { toast } from "react-hot-toast";

/**
 * @const {object} validationSchema
 * @description Esquema de validación de Yup para el formulario inicial de requerimiento.
 */
export const validationSchema = Yup.object({
  asunto: Yup.string()
    .required("El asunto es obligatorio.")
    .max(100, "El asunto no debe exceder los 100 caracteres."),
  detalle_necesidad: Yup.string()
    .required("La descripción de la necesidad es obligatoria.")
    .min(20, "La descripción debe tener al menos 20 caracteres.")
    .max(500, "La descripción no debe exceder los 500 caracteres."),
});

/**
 * @const {object} initialValues
 * @description Objeto que define los valores iniciales del formulario.
 */
export const initialValues = {
  asunto: "",
  detalle_necesidad: "",
};

/**
 * @function useCreateRequirementForm
 * @description Hook personalizado que encapsula la lógica de envío del formulario.
 * @param {Function} onSuccess - Callback que se ejecuta cuando la petición a la API es exitosa.
 * @returns {object} Un objeto que contiene la función `handleSubmit` y el estado `isSubmitting`.
 */
export default function useCreateRequirementForm(onSuccess) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * @async
   * @function handleSubmit
   * @description Función que maneja el envío del formulario a la API.
   * @param {object} values - Los valores actuales del formulario.
   */
  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      // Llama al endpoint de inicio de requerimiento.
      // El backend debe asignar el centro de operación y el estado inicial.
      const response = await api.post("/api/requerimientos", values);

      // Mostrar notificación de éxito
      toast.success(
        `Requerimiento ${response.data.codigo} creado y enviado a TI para análisis.`
      );

      // Ejecutar callback de éxito
      if (onSuccess) {
        onSuccess("Requerimiento inicial creado.");
      }
    } catch (error) {
      console.error("Error al crear el requerimiento inicial:", error);
      toast.error(
        error.response?.data?.message ||
          "Error al crear el requerimiento. Inténtalo de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting, initialValues, validationSchema };
}
