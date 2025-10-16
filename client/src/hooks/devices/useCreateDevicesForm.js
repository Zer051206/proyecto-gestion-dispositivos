/**
 * @file useCreateDevicesForm.js
 * @module Hooks/Devices
 * @description Hook personalizado para gestionar la lógica del formulario dinámico de creación de equipos.
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
 * @const {object} initialDeviceValues
 * @description Define la estructura y los valores iniciales para un nuevo objeto de equipo en blanco.
 * Se utiliza para inicializar el formulario y para añadir nuevas filas en el FieldArray.
 */
export const initialDeviceValues = {
  serial: "",
  equipo_laptop: true,
  tamano_disco_duro: "",
  equipo_tarjeta_grafica: false,
  referencia_tarjeta_grafica: "",
  serial_pantalla: "",
  equipo_alquilado: false,
  activo_fijo: false,
  codigo_activo_fijo: "",
  id_centro_operacion: "",
  estado_equipo: true,
};

/**
 * @function useCreateDevicesForm
 * @description Hook de React que proporciona toda la lógica y el estado necesarios para un formulario de creación de múltiples equipos.
 * @param {Function} onSuccess - Una función callback que se ejecuta cuando la petición a la API es exitosa. Recibe un mensaje de éxito como argumento.
 * @returns {object} La instancia completa de Formik, que contiene el estado (`values`, `errors`, `isSubmitting`),
 * los manejadores de eventos (`handleSubmit`, `getFieldProps`) y otras utilidades.
 */
export const useCreateDevicesForm = (onSuccess) => {
  // Obtenemos el usuario logueado para aplicar validaciones condicionales.
  const { user } = useAuthStore();
  const isAdmin = user?.rol === "Admin";

  /**
   * @const {Yup.ObjectSchema} deviceValidationSchema
   * @description Esquema de validación de Yup para UN SOLO objeto de equipo.
   * Contiene reglas condicionales que se aplican dinámicamente basadas en otros campos del formulario.
   */
  const deviceValidationSchema = Yup.object({
    serial: Yup.string().required("El serial es obligatorio."),
    equipo_laptop: Yup.boolean().required(),
    tamano_disco_duro: Yup.number()
      .typeError("Debe ser un número.")
      .positive("Debe ser positivo.")
      .required("El tamaño del disco es obligatorio."),
    equipo_tarjeta_grafica: Yup.boolean().required(),
    referencia_tarjeta_grafica: Yup.string().when("equipo_tarjeta_grafica", {
      is: true,
      then: (schema) =>
        schema
          .trim()
          .required("La referencia es obligatoria si tiene tarjeta gráfica."),
    }),
    serial_pantalla: Yup.string().when("equipo_laptop", {
      is: false, // Se aplica cuando NO es laptop (es PC de escritorio)
      then: (schema) =>
        schema
          .trim()
          .required(
            "El serial de la pantalla es obligatorio para PCs de escritorio."
          ),
    }),
    equipo_alquilado: Yup.boolean().required(),
    activo_fijo: Yup.boolean().required(),
    codigo_activo_fijo: Yup.string().trim().nullable(),
    // Validación condicional para el centro de operación basado en el rol del usuario.
    id_centro_operacion: isAdmin
      ? Yup.number()
          .positive("Debe seleccionar un centro de operación.")
          .required("El centro de operación es obligatorio.")
      : Yup.string().notRequired(), // Para Encargados, no se valida.
  });

  /**
   * @const {object} formik
   * @description Instancia de Formik creada con `useFormik`.
   * Maneja el estado del formulario, la validación y la lógica de envío.
   */
  const formik = useFormik({
    initialValues: {
      devices: [initialDeviceValues],
    },
    validationSchema: Yup.object({
      devices: Yup.array()
        .of(deviceValidationSchema)
        .min(1, "Debes agregar al menos un equipo."),
    }),
    /**
     * @function onSubmit
     * @description Función que se ejecuta al enviar el formulario, solo si la validación es exitosa.
     * Envía los datos a la API y maneja las respuestas de éxito o error.
     * @param {object} values - Los valores actuales del formulario.
     * @param {object} formikHelpers - Objeto con helpers de Formik (ej. setFieldError).
     */
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        // El servicio del backend se encargará de asignar el id_centro_operacion si es un Encargado
        await api.post("/api/dispositivos", values.devices);
        if (onSuccess) {
          onSuccess(
            `¡${values.devices.length} equipo(s) creado(s) exitosamente!`
          );
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "Ocurrió un error al crear los equipos.";
        setFieldError("apiError", errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return formik;
};
