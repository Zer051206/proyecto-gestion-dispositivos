import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import api from "../../config/axios.js";

// Esquema de validación con Yup para crear un usuario
const validationSchema = Yup.object({
  nombre: Yup.string().required("El nombre es obligatorio.").min(2),
  apellido: Yup.string().required("El apellido es obligatorio.").min(2),
  correo: Yup.string()
    .email("El formato del correo no es válido.")
    .required("El correo es obligatorio."),
  id_tipo_identificacion: Yup.number()
    .required("El tipo de identificación es obligatorio.")
    .positive(),
  identificacion: Yup.string()
    .required("El número de identificación es obligatorio.")
    .min(5),
  telefono: Yup.string().required("El teléfono es obligatorio.").min(7),
  rol: Yup.string()
    .oneOf(["Admin", "Encargado"], "Rol no válido.")
    .required("El rol es obligatorio."),
  id_centro_operacion: Yup.number().when("rol", {
    is: "Encargado",
    then: (schema) =>
      schema
        .required("Un 'Encargado' debe tener un centro de operación.")
        .positive(),
    otherwise: (schema) => schema.nullable(),
  }),
  password: Yup.string().required("La contraseña es obligatoria.").min(8),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden.")
    .required("Debes confirmar la contraseña."),
});

export const useCreateUserForm = () => {
  const [successMessage, setSuccessMessage] = useState(null);

  const handleClearForm = () => {
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
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
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setFieldError, resetForm, setSubmitting }) => {
      setSuccessMessage(null);
      try {
        // Excluimos confirmPassword antes de enviar a la API
        const { confirmPassword, ...userData } = values;

        await api.post("/api/usuarios", userData);

        setSuccessMessage(`¡Usuario '${userData.nombre}' creado exitosamente!`);
        resetForm();
      } catch (err) {
        if (err.response?.data?.errors) {
          err.response.data.errors.forEach((error) => {
            setFieldError(error.path, error.message);
          });
        } else {
          const errorMessage =
            err.response?.data?.message || "Ha ocurrido un error inesperado.";
          setFieldError("apiError", errorMessage);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return { formik, successMessage, handleClearForm };
};
