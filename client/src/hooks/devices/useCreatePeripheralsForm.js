/**
 * @file useCreatePeripheralsForm.js
 * @module Hooks/Devices
 * @description Hook personalizado para gestionar la lógica del formulario dinámico de creación de periféricos.
 * Este hook encapsula la validación con Yup (incluyendo reglas condicionales basadas en el rol del usuario),
 * el estado del formulario con Formik y la lógica de envío de datos a la API.
 * @requires formik
 * @requires yup
 * @requires ../../config/axios.js
 * @requires ../../stores/authStore.js
 */
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../config/axios.js";
import { useAuthStore } from "../../stores/authStore.js";

/**
 * @const {Yup.ObjectSchema} peripheralValidationSchema
 * @description Esquema base de validación de Yup para UN SOLO objeto de periférico.
 * No incluye la validación de `id_centro_operacion`, ya que esta es condicional y se añade dinámicamente.
 */
const peripheralValidationSchema = Yup.object({
  serial_periferico: Yup.string().required("El serial es obligatorio."),
  marca_periferico: Yup.string().required("La marca es obligatoria."),
  activo_fijo: Yup.boolean().required("Debes indicar si es un activo fijo."),
  codigo_activo_fijo: Yup.string().when("activo_fijo", {
    is: true,
    then: (schema) => schema.trim(),
  }),
  id_tipo_periferico: Yup.number()
    .positive("Debe seleccionar un tipo de periférico.")
    .required("El tipo de periférico es obligatorio."),
  // La validación del centro de operación se hará en el hook principal
});

/**
 * @const {object} initialPeripheralValues
 * @description Define la estructura y los valores iniciales para un nuevo objeto de periférico en blanco.
 */
export const initialPeripheralValues = {
  serial_periferico: "",
  marca_periferico: "",
  activo_fijo: false,
  codigo_activo_fijo: "",
  id_tipo_periferico: "",
  id_centro_operacion: "",
  estado_periferico: true,
  has_cost_center: false,
  id_centro_costo: "",
};

/**
 * @function useCreatePeripheralsForm
 * @description Hook de React que proporciona toda la lógica y el estado para un formulario de creación de múltiples periféricos.
 * @param {Function} onSuccess - Una función callback que se ejecuta cuando la petición a la API es exitosa.
 * @returns {object} La instancia completa de Formik.
 */
export const useCreatePeripheralsForm = (onSuccess) => {
  // Obtenemos el usuario logueado para aplicar validaciones condicionales.
  const { user } = useAuthStore();
  const isAdmin = user?.rol === "Admin";

  /**
   * @const {Yup.ObjectSchema} finalValidationSchema
   * @description Esquema de validación final y dinámico.
   * Toma el esquema base y le añade la regla para `id_centro_operacion` solo si el usuario es Admin.
   */
  const finalValidationSchema = peripheralValidationSchema.shape({
    id_centro_operacion: isAdmin
      ? Yup.number()
          .positive("Debe seleccionar un centro.")
          .required("El centro es obligatorio.")
      : Yup.string().notRequired(), // Para Encargados, este campo no se valida en el frontend.

    has_cost_center: Yup.boolean(),
    id_centro_costo: Yup.number().when("has_cost_center", {
      is: true,
      then: (schema) =>
        schema
          .positive("Debe seleccionar un centro.")
          .required("El centro de costo es obligatorio."),
      otherwise: (schema) => schema.trim().nullable(),
    }),
  });

  /**
   * @const {object} formik
   * @description Instancia de Formik creada con `useFormik` que maneja todo el estado del formulario.
   */
  const formik = useFormik({
    initialValues: {
      peripherals: [initialPeripheralValues],
    },
    validationSchema: Yup.object({
      peripherals: Yup.array()
        .of(finalValidationSchema)
        .min(1, "Debes agregar al menos un periférico."),
    }),
    /**
     * @function onSubmit
     * @description Función que se ejecuta al enviar el formulario si la validación es exitosa.
     * @param {object} values - Los valores actuales del formulario.
     * @param {object} formikHelpers - Objeto con helpers de Formik.
     */
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        // El backend se encarga de asignar el id_centro_operacion si el usuario es un Encargado.
        await api.post("/api/perifericos", values.peripherals);
        if (onSuccess) {
          onSuccess(
            `¡${values.peripherals.length} periférico(s) creado(s) exitosamente!`
          );
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "Ocurrió un error al crear los periféricos.";
        setFieldError("apiError", errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return formik;
};
