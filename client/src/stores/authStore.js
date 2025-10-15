import { create } from "zustand";
import api from "../config/axios.js";

/**
 * @file authStore.js
 * @module Stores/Auth
 * @description Contiene el store global de Zustand para la gestión del estado de autenticación en toda la aplicación.
 * Implementa un patrón de sesión persistente con localStorage para una carga rápida y revalidación en segundo plano.
 */

/**
 * @function getInitialState
 * @private
 * @description Lee el estado de sesión inicial desde `localStorage` al cargar la aplicación.
 * Esto permite una experiencia de usuario optimista, cargando la UI autenticada instantáneamente si existe una sesión guardada.
 * @returns {object} El estado inicial para el store de autenticación.
 */
const getInitialState = () => {
  try {
    const user = localStorage.getItem("user");
    if (user) {
      return {
        isAuthenticated: true,
        user: JSON.parse(user),
        isLoading: false, // La UI puede renderizarse, la revalidación se hará en segundo plano.
      };
    }
  } catch (error) {
    // Si localStorage está corrupto, lo limpiamos para evitar errores.
    localStorage.clear();
  }
  // Estado por defecto si no hay sesión guardada o si hubo un error.
  return { isAuthenticated: false, user: null, isLoading: true };
};

/**
 * @constant useAuthStore
 * @description Store de Zustand que expone el estado y las acciones de autenticación.
 * @property {boolean} isAuthenticated - `true` si el usuario está considerado como autenticado.
 * @property {object|null} user - Objeto con los datos del usuario autenticado.
 * @property {boolean} isLoading - `true` solo durante la verificación inicial de la sesión al cargar la app.
 * @property {Function} login - Acción para iniciar sesión.
 * @property {Function} logout - Acción para cerrar sesión.
 * @property {Function} checkAuthStatus - Acción para revalidar la sesión con el backend.
 */
export const useAuthStore = create((set, get) => ({
  // --- ESTADO (STATE) ---
  ...getInitialState(),

  // --- ACCIONES (ACTIONS) ---

  /**
   * @function login
   * @description Establece el estado de autenticación y guarda la sesión (datos de usuario y tokens) en localStorage.
   * @param {object} userData - El objeto de usuario recibido de la API.
   * @param {string} accessToken - El token de acceso JWT.
   * @param {string} refreshToken - El token de refresco.
   * @returns {void}
   */
  login: (userData, accessToken, refreshToken) => {
    set({ isAuthenticated: true, user: userData, isLoading: false });
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  /**
   * @function logout
   * @description Cierra la sesión del usuario. Llama a la API para invalidar el refresh token,
   * limpia el localStorage y resetea el estado del store.
   * @returns {void}
   */
  logout: async () => {
    try {
      // CORREGIDO: Typo de 'refresToken' a 'refreshToken'
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (error) {
      console.error("Error al invalidar el token en el backend:", error);
    } finally {
      // Esta limpieza se ejecuta siempre, asegurando que la sesión se cierre en el frontend.
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  },

  /**
   * @function checkAuthStatus
   * @description Revalida la sesión actual en segundo plano llamando al endpoint `/auth/me`.
   * Se utiliza al cargar la aplicación para sincronizar el estado del frontend con el del backend.
   * Si la revalidación falla, se encarga de limpiar la sesión local.
   * @returns {void}
   */
  checkAuthStatus: async () => {
    if (!localStorage.getItem("accessToken")) {
      return set({ isAuthenticated: false, user: null, isLoading: false });
    }

    try {
      const response = await api.get("/auth/me");
      const user = response.data.user; // La respuesta del backend ahora es { authenticated, user }

      set({
        isAuthenticated: true,
        user: user,
        isLoading: false,
      });
      // Sincroniza localStorage con cualquier dato actualizado del usuario (ej. si cambió su nombre)
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error(
        "Fallo en la verificación de sesión, cerrando sesión localmente."
      );
      // Si el token ya no es válido, llamamos a logout() para una limpieza completa y segura.
      get().logout();
    }
  },
}));
