/**
 * @file useLoginForm.js
 * @module Hooks/Auth
 * @description Hook personalizado que encapsula toda la lógica y el estado para el formulario de inicio de sesión.
 * Utiliza Formik para la gestión del formulario, Yup para la validación de datos del lado del cliente,
 * y se integra con el store de autenticación global (Zustand) para manejar la sesión del usuario.
 * @requires formik
 * @requires yup
 * @requires react-router-dom
 * @requires ../../config/axios.js
 * @requires ../../stores/authStore.js
 */
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios.js";
import { useAuthStore } from "../../stores/authStore.js";

/**
 * @const {Yup.ObjectSchema} validationSchema
 * @description Define el esquema de validación para los campos del formulario de login.
 * Se asegura de que el correo electrónico tenga un formato válido y que ambos campos sean obligatorios.
 */
const validationSchema = Yup.object({
  correo: Yup.string()
    .email("El formato del correo no es válido.")
    .required("El correo es obligatorio."),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres.")
    .required("La contraseña es obligatoria."),
});

/**
 * @function useLoginForm
 * @description Hook de React que proporciona toda la lógica y el estado necesarios para el componente `LoginForm`.
 * @returns {object} La instancia completa de Formik, que contiene el estado (`values`, `errors`, `isSubmitting`),
 * los manejadores de eventos (`handleSubmit`, `getFieldProps`) y otras utilidades para ser usadas en el componente de la vista.
 */
export const useLoginForm = () => {
  const navigate = useNavigate();

  /**
   * @description Obtiene la acción `login` del store de autenticación global.
   * Esta acción se encargará de actualizar el estado de la aplicación y guardar los datos de sesión.
   */
  const login = useAuthStore((state) => state.login);

  /**
   * @const {object} formik
   * @description Instancia de Formik creada con `useFormik`.
   * Es el cerebro del formulario, manejando sus valores, validación y envío.
   */
  const formik = useFormik({
    // Valores iniciales de los campos
    initialValues: {
      correo: "",
      password: "",
    },
    // El esquema de validación que creamos con Yup
    validationSchema: validationSchema,

    /**
     * @function onSubmit
     * @description Función que se ejecuta al enviar el formulario, solo si la validación es exitosa.
     * Realiza la llamada a la API de login, maneja la respuesta de éxito o error, actualiza el estado global
     * y redirige al usuario.
     * @param {object} values - Los valores actuales de los campos del formulario.
     * @param {object} formikHelpers - Objeto con helpers de Formik (ej. setFieldError).
     * @async
     */
    onSubmit: async (values, { setFieldError }) => {
      try {
        const response = await api.post("/auth/login", values);

        // Si la petición es exitosa, se llama a la acción 'login' del store
        // para guardar los datos del usuario y los tokens.
        login(
          response.data.user,
          response.data.accessToken,
          response.data.refreshToken
        );

        // Si el login es exitoso, las cookies se establecen automáticamente.
        // Redirigimos al usuario al dashboard.
        navigate("/dashboard");
      } catch (err) {
        // Manejo de errores de la API.
        if (err.response?.data?.errors) {
          // Si el backend devuelve errores de validación específicos (de Zod).
          err.response.data.errors.forEach((error) => {
            setFieldError(error.path, error.message);
          });
        } else {
          // Si es un error general (ej. "credenciales incorrectas").
          const errorMessage =
            err.response?.data?.message || "Ha ocurrido un error inesperado.";
          setFieldError("apiError", errorMessage);
        }
      }
      // Formik maneja automáticamente el estado de 'isSubmitting'
    },
  });

  // Devuelve la instancia de Formik para que el componente LoginForm pueda usarla.
  return formik;
};
