/**
 * @file useLoginForm.js
 * @module Hooks
 * @description Hook personalizado que maneja el estado del formulario de inicio de sesión,
 * incluyendo la validación, la comunicación con el endpoint de login de la API, y la navegación
 * post-autenticación.
 * @requires react/useState
 * @requires ../../axiosClient
 * @requires react-router-dom/useNavigate
 */
import { useState } from "react";
import axiosClient from "../../axiosClient.js";
import { useNavigate } from "react-router-dom";

/**
 * @function useLoginForm
 * @description Hook para gestionar el formulario de inicio de sesión.
 * Mantiene el estado del correo, contraseña, errores y el estado de carga,
 * y proporciona la función `handleLogin` para comunicarse con la API.
 *
 * @returns {object} Un objeto que contiene el estado de los campos, el manejador de envío y las funciones de actualización.
 *
 * @property {string} email - Estado actual del campo de correo electrónico.
 * @property {string} password - Estado actual del campo de contraseña.
 * @property {Function} handleLogin - Función asíncrona que maneja el envío del formulario a la API.
 * @property {Function} handleEmailChange - Manejador de cambio para el input de correo.
 * @property {Function} handlePasswordChange - Manejador de cambio para el input de contraseña.
 * @property {string | null} error - Mensaje de error a mostrar al usuario si la autenticación falla.
 * @property {boolean} isLoading - Indicador de estado de carga mientras se espera la respuesta de la API.
 */
export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);

  const handlePasswordChange = (e) => setPassword(e.target.value);

  /**
   * @async
   * @description Función que se ejecuta al enviar el formulario.
   * Envía las credenciales al endpoint de login.
   * Si tiene éxito, redirige al usuario al dashboard.
   * @param {Event} e - El evento del formulario (utilizado para prevenir el comportamiento por defecto).
   * @returns {void}
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Se utiliza withCredentials: true para asegurar que las cookies (tokens) sean enviadas y recibidas
      await axiosClient.post(
        "/auth/login",
        {
          correo: email,
          password,
        },
        { withCredentials: true }
      );

      // Navegar a la página principal de la aplicación
      navigate("/dashboard");
    } catch (err) {
      // Manejo de errores de respuesta de la API
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(
          "Error al iniciar sesión. Por favor, verifica tus credenciales."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    password,
    handleLogin,
    handleEmailChange,
    handlePasswordChange,
    error,
    isLoading,
  };
};
