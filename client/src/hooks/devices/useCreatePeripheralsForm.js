import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../config/axios.js";

// 1. Esquema de validación con Yup para UN SOLO periférico.
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
  id_centro_operacion: Yup.number()
    .positive("Debe seleccionar un centro de operación.")
    .required("El centro de operación es obligatorio."),
});

// 2. Valores iniciales para un nuevo periférico en blanco.
export const initialPeripheralValues = {
  serial_periferico: "",
  marca_periferico: "",
  periferico_etiquetado: false,
  etiqueta_periferico: "",
  activo_fijo: false,
  codigo_activo_fijo: "",
  id_tipo_periferico: "",
  id_centro_operacion: "",
  estado_periferico: true, // Por defecto, un periférico nuevo está activo
};

/**
 * Hook para gestionar el formulario dinámico de creación de periféricos.
 * @param {Function} onSuccess - Callback a ejecutar cuando la creación es exitosa.
 */
export const useCreatePeripheralsForm = (onSuccess) => {
  const formik = useFormik({
    // El estado principal es un array de periféricos
    initialValues: {
      peripherals: [initialPeripheralValues],
    },
    // El esquema valida que el estado sea un array de objetos que cumplan con la forma definida
    validationSchema: Yup.object({
      peripherals: Yup.array()
        .of(peripheralValidationSchema)
        .min(1, "Debes agregar al menos un periférico."),
    }),
    // Lógica que se ejecuta al enviar el formulario (solo si es válido)
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        // Enviamos el array de periféricos al endpoint del backend
        await api.post("/api/perifericos", values.peripherals);

        // Si la operación fue exitosa, llamamos al callback 'onSuccess'
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
