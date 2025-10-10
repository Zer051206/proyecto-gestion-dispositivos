import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../config/axios.js";

// Define el esquema de validación para UN solo equipo
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
    otherwise: (schema) => schema.nullable(),
  }),
  serial_pantalla: Yup.string().when("equipo_laptop", {
    is: false, // Se aplica cuando NO es laptop (es PC de escritorio)
    then: (schema) =>
      schema
        .trim()
        .required(
          "El serial de la pantalla es obligatorio para PCs de escritorio."
        ),
    otherwise: (schema) => schema.nullable(),
  }),
  equipo_alquilado: Yup.boolean().required(),
  activo_fijo: Yup.boolean().required(),
  codigo_activo_fijo: Yup.string().when("activo_fijo", {
    is: true,
    then: (schema) => schema.trim(),
  }),
  id_centro_operacion: Yup.number()
    .positive("Debe seleccionar un centro de operación.")
    .required("El centro de operación es obligatorio."),
});

// Define los valores iniciales para un nuevo equipo en blanco
export const initialDeviceValues = {
  serial: "",
  equipo_laptop: true,
  tamano_disco_duro: "",
  equipo_tarjeta_grafica: false,
  referencia_tarjeta_grafica: "",
  serial_pantalla: "",
  equipo_alquilado: false,
  equipo_etiquetado: false,
  equipo_etiqueta: "",
  activo_fijo: false,
  codigo_activo_fijo: "",
  id_centro_operacion: "",
  estado_equipo: true, // Por defecto, un equipo nuevo está activo
};

export const useCreateDevicesForm = (onSuccess) => {
  const formik = useFormik({
    initialValues: {
      devices: [initialDeviceValues],
    },
    validationSchema: Yup.object({
      devices: Yup.array()
        .of(deviceValidationSchema)
        .min(1, "Debes agregar al menos un equipo."),
    }),
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        await api.post("/api/equipos", values.devices);
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
