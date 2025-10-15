import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../config/axios.js";
import { useAuthStore } from "../../stores/authStore.js";

// Valores iniciales para un nuevo equipo en blanco
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

export const useCreateDevicesForm = (onSuccess) => {
  // Obtenemos el usuario logueado para saber su rol
  const { user } = useAuthStore();
  const isAdmin = user?.rol === "Admin";
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
      is: false,
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
    id_centro_operacion: isAdmin
      ? Yup.number()
          .positive("Debe seleccionar un centro de operación.")
          .required("El centro de operación es obligatorio.")
      : Yup.string().notRequired(), // Para Encargados, no se valida.
  });

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
