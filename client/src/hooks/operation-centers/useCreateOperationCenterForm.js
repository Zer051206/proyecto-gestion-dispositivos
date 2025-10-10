import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../config/axios.js";

// Esquema de validación con Yup para UN SOLO centro de operación
const centerValidationSchema = Yup.object({
  codigo: Yup.number()
    .typeError("El código debe ser un número.")
    .positive("El código debe ser un número positivo.")
    .required("El código es obligatorio."),
  direccion: Yup.string()
    .min(5, "La dirección debe tener al menos 5 caracteres.")
    .required("La dirección es obligatoria."),
  correo: Yup.string()
    .email("El formato del correo no es válido.")
    .required("El correo es obligatorio."),
  telefono: Yup.string()
    .min(9, "El teléfono debe tener al menos 9 caracteres.")
    .required("El teléfono es obligatorio."),
  id_ciudad: Yup.number()
    .positive("Debe seleccionar una ciudad.")
    .required("La ciudad es obligatoria."),
});

// Valores iniciales para un nuevo centro de operación en blanco
export const initialCenterValues = {
  codigo: "",
  direccion: "",
  correo: "",
  telefono: "",
  id_ciudad: "",
};

/**
 * Hook para gestionar el formulario dinámico de creación de centros de operación.
 * @param {Function} onSuccess - Callback a ejecutar cuando la creación es exitosa.
 */
export const useCreateOperationCenterForm = (onSuccess) => {
  const formik = useFormik({
    initialValues: {
      centers: [initialCenterValues],
    },
    validationSchema: Yup.object({
      centers: Yup.array()
        .of(centerValidationSchema)
        .min(1, "Debes agregar al menos un centro de operación."),
    }),
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        // El backend espera un array de centros
        await api.post("/api/centros-operacion", values.centers);
        if (onSuccess) {
          onSuccess(
            `¡${values.centers.length} centro(s) de operación creado(s) exitosamente!`
          );
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "Ocurrió un error al crear los centros de operación.";
        setFieldError("apiError", errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return formik;
};
