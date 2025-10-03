/**
 * @file useAuthLogout.js
 * @module Hooks/Auth
 * @description Hook personalizado que proporciona la funcionalidad para cerrar la sesión del usuario.
 * Llama al endpoint de 'logout' del backend y redirige al usuario al formulario de inicio de sesión.
 * @requires react-router-dom/useNavigate
 * @requires ../config/axios (Asumido como la instancia de Axios configurada)
 */
import { useNavigate } from "react-router-dom";
import api from "../../config/axios"; // Importa la instancia de Axios configurada

/**
 * @function useAuthLogout
 * @description Proporciona la función `logout` para finalizar la sesión del usuario.
 *
 * @returns {object} Un objeto que contiene la función de cierre de sesión.
 * @property {Function} logout - Función asíncrona para ejecutar el proceso de cierre de sesión.
 */
const useAuthLogout = () => {
  const navigate = useNavigate();

  /**
   * @async
   * @function logout
   * @description Llama al endpoint de la API para cerrar la sesión, eliminando la cookie de sesión
   * en el backend, y luego redirige al usuario a la página de login.
   * @returns {void}
   */
  const logout = async () => {
    try {
      // Llama al endpoint de logout en el backend (POST /auth/logout)
      await api.post("/auth/logout");

      // Redirige al usuario a la página de login después del éxito
      navigate("/auth/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Aunque falle el backend, se redirige para asegurar que el usuario vea la pantalla de login.
      navigate("/auth/login");
    }
  };

  return { logout };
};

export default useAuthLogout;
