// src/stores/authStore.js
import { create } from "zustand";
import api from "../config/axios.js";

/**
 * @function useAuthStore
 * @description Store de Zustand para gestionar el estado de autenticación global.
 */
export const useAuthStore = create((set) => ({
  // --- 1. ESTADO (STATE) ---
  isAuthenticated: false,
  user: null,
  isLoading: true, // Inicia en true para la verificación inicial

  // --- 2. ACCIONES (ACTIONS) ---

  /**
   * @function checkAuthStatus
   * @description Verifica la sesión contra el endpoint /auth/me.
   * Se debe llamar una sola vez al iniciar la aplicación.
   */
  checkAuthStatus: async () => {
    try {
      const response = await api.get("/auth/status");

      if (response.data.authenticated) {
        set({
          isAuthenticated: true,
          user: response.data.user,
          isLoading: false,
        });
      } else {
        set({ isAuthenticated: false, user: null, isLoading: false });
      }
    } catch (error) {
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  },

  /**
   * @function login
   * @description Marca al usuario como autenticado después de un inicio de sesión exitoso.
   * @param {object} userData - Los datos del usuario recibidos de la API.
   */
  login: (userData) => {
    set({ isAuthenticated: true, user: userData });
  },

  /**
   * @function logout
   * @description Cierra la sesión del usuario.
   * Llama a la API y luego actualiza el estado global.
   */
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Error al cerrar sesión en el backend:", error);
      // No importa si el backend falla, limpiamos el estado del frontend
    } finally {
      // Limpiamos el estado y dejamos que el componente se encargue de la redirección.
      set({ isAuthenticated: false, user: null });
    }
  },
}));
