import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../config/axios.js";

// Esquema de validación para UN solo usuario
const userValidationSchema = Yup.object({
  nombre: Yup.string()
    .required("El nombre es obligatorio.")
    .min(2, "Debe tener al menos 2 caracteres."),
  apellido: Yup.string()
    .required("El apellido es obligatorio.")
    .min(2, "Debe tener al menos 2 caracteres."),
  correo: Yup.string()
    .email("El formato del correo no es válido.")
    .required("El correo es obligatorio."),
  id_tipo_identificacion: Yup.number()
    .positive("Debe seleccionar un tipo de identificación.")
    .required("El tipo de identificación es obligatorio."),
  identificacion: Yup.string()
    .min(5, "La identificación debe tener al menos 5 caracteres.")
    .required("La identificación es obligatoria."),
  telefono: Yup.string()
    .min(7, "El teléfono debe tener al menos 7 caracteres.")
    .required("El teléfono es obligatorio."),
  rol: Yup.string()
    .oneOf(["Admin", "Encargado"], "El rol seleccionado no es válido.")
    .required("El rol es obligatorio."),
  id_centro_operacion: Yup.number().when("rol", {
    is: "Encargado",
    then: (schema) =>
      schema
        .positive("Un 'Encargado' debe tener un centro de operación.")
        .required("El centro de operación es obligatorio."),
    // Si es 'Admin', el campo puede ser nulo.
    otherwise: (schema) => schema.nullable().transform(() => null),
  }),
  password: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .required("La contraseña es obligatoria."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir.")
    .required("Debes confirmar la contraseña."),
});

// Valores iniciales para un nuevo usuario en blanco
export const initialUserValues = {
  nombre: "",
  apellido: "",
  correo: "",
  id_tipo_identificacion: "",
  identificacion: "",
  telefono: "",
  rol: "Encargado",
  id_centro_operacion: "",
  password: "",
  confirmPassword: "",
};

/**
 * Hook para gestionar el formulario dinámico de creación de usuarios.
 * @param {Function} onSuccess - Callback a ejecutar cuando la creación es exitosa.
 */
export const useCreateUserForm = (onSuccess) => {
  const formik = useFormik({
    // El estado principal es un array de usuarios
    initialValues: {
      users: [initialUserValues],
    },
    // El esquema valida que el estado sea un array de objetos que cumplan con la forma definida
    validationSchema: Yup.object({
      users: Yup.array()
        .of(userValidationSchema)
        .min(1, "Debes agregar al menos un usuario."),
    }),
    // Lógica que se ejecuta al enviar el formulario (solo si es válido)
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        // Mapeamos los usuarios para quitar 'confirmPassword' de cada uno antes de enviar a la API
        const usersToSubmit = values.users.map(
          ({ confirmPassword, ...user }) => user
        );

        await api.post("/api/usuarios", usersToSubmit);

        // Si la operación fue exitosa, llamamos al callback 'onSuccess'
        if (onSuccess) {
          onSuccess(
            `¡${values.users.length} usuario(s) creado(s) exitosamente!`
          );
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "Ocurrió un error inesperado al crear los usuarios.";
        setFieldError("apiError", errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return formik;
};
