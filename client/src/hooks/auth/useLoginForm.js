// src/hooks/auth/useLoginForm.js

import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios.js"; // Usamos la instancia inteligente de Axios
import { useAuthStore } from "../../stores/authStore.js";

// 1. Definimos el esquema de validación con Yup
// Esto valida los datos en el frontend ANTES de enviarlos
const validationSchema = Yup.object({
  correo: Yup.string()
    .email("El formato del correo no es válido.")
    .required("El correo es obligatorio."),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres.")
    .required("La contraseña es obligatoria."),
});

export const useLoginForm = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login); // Obtenemos la acción de login del store

  // 2. Usamos el hook useFormik para gestionar todo el formulario
  const formik = useFormik({
    // Valores iniciales de los campos
    initialValues: {
      correo: "",
      password: "",
    },
    // El esquema de validación que creamos con Yup
    validationSchema: validationSchema,

    // La función que se ejecuta SOLO si la validación es exitosa
    onSubmit: async (values, { setFieldError }) => {
      try {
        const response = await api.post("/auth/login", values);

        login(
          response.data.user,
          response.data.accessToken,
          response.data.refreshToken
        );

        // Si el login es exitoso, las cookies se establecen automáticamente.
        // Redirigimos al usuario al dashboard.
        navigate("/dashboard");
      } catch (err) {
        // Primero, comprobamos si la respuesta del error tiene el array 'errors' de Zod/Sequelize
        if (err.response?.data?.errors) {
          // Si es así, recorremos el array
          err.response.data.errors.forEach((error) => {
            // Y usamos setFieldError para asignar cada mensaje de error a su campo correspondiente
            setFieldError(error.path, error.message);
          });
        } else {
          // Si no hay un array, es un error general (como "credenciales incorrectas")
          // Lo asignamos al campo 'apiError' que ya tienes
          const errorMessage =
            err.response?.data?.message || "Ha ocurrido un error inesperado.";
          setFieldError("apiError", errorMessage);
        }
      }
      // Formik maneja automáticamente el estado de 'isSubmitting'
    },
  });

  // 3. Devolvemos el objeto formik que contiene todo lo que necesitamos
  return formik;
};
