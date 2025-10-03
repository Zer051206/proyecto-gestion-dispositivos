/**
 * @file useAuthStatus.js
 * @module Hooks/Auth
 * @description Hook personalizado encargado de verificar el estado de autenticación del usuario
 * al cargar la aplicación. Llama al endpoint de verificación del backend.
 * @requires react/useState, useEffect
 * @requires ../config/axios - Instancia de Axios configurada para la API.
 */
import { useState, useEffect } from "react";
import api from "../../config/axios.js"; // Importa la instancia de Axios configurada

/**
 * @function useAuthStatus
 * @description Realiza una llamada asíncrona al servidor para determinar si el usuario
 * tiene una sesión activa (token válido).
 *
 * @returns {object} Un objeto que contiene el estado de autenticación y carga.
 * @property {boolean} isAuthenticated - Verdadero si la API confirma una sesión válida.
 * @property {boolean} isLoading - Verdadero mientras se espera la respuesta de la API.
 */
const useAuthStatus = () => {
  /**
   * @const {boolean} isAuthenticated
   * @description Estado que rastrea si el usuario está actualmente autenticado.
   */
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * @const {boolean} isLoading
   * @description Estado que rastrea si la verificación de autenticación está en curso.
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * @effect
   * @description Hook de efecto que se ejecuta una sola vez al montar el componente
   * para verificar el estado de la sesión con la API.
   */
  useEffect(() => {
    /**
     * @async
     * @function checkAuth
     * @description Función asíncrona que realiza la solicitud GET al endpoint `/auth/me`
     * para verificar la validez del token de sesión.
     * @returns {void}
     */
    const checkAuth = async () => {
      try {
        // Llama al endpoint de verificación (ej. /auth/me)
        const response = await api.get("/auth/me");

        // Asume que la API devuelve { authenticated: true/false }
        if (response.data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Cualquier error de la API (incluyendo 401 si falla el refresh token)
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []); // El array vacío asegura que solo se ejecute al montar

  return { isAuthenticated, isLoading };
};

export default useAuthStatus;
