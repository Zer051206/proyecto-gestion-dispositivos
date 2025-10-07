import { create } from "zustand";
import api from "../config/axios.js";

/**
 * @function getInitialState
 * @description Lee el estado inicial del usuario desde localStorage para una carga instantánea de la sesión.
 */
const getInitialState = () => {
  try {
    const user = localStorage.getItem("user");
    // Si encontramos un usuario en localStorage, asumimos que está autenticado inicialmente.
    if (user) {
      return {
        isAuthenticated: true,
        user: JSON.parse(user),
        isLoading: false,
      };
    }
  } catch (error) {
    // Si hay un error (ej. JSON corrupto), limpiamos localStorage.
    localStorage.clear();
  }
  // Estado por defecto si no hay sesión guardada.
  return { isAuthenticated: false, user: null, isLoading: true }; // isLoading en true para la verificación inicial
};

/**
 * @function useAuthStore
 * @description Store de Zustand para gestionar el estado y las acciones de autenticación global.
 */
export const useAuthStore = create((set, get) => ({
  // --- ESTADO (STATE) ---
  ...getInitialState(),

  // --- ACCIONES (ACTIONS) ---

  /**
   * @function login
   * @description Guarda los tokens y los datos del usuario tras un inicio de sesión exitoso.
   */
  login: (userData, accessToken, refreshToken) => {
    set({ isAuthenticated: true, user: userData });
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  /**
   * @function logout
   * @description Cierra la sesión del usuario, limpia el estado y el localStorage.
   */
  logout: async () => {
    try {
      // Opcional: Llama al endpoint de logout del backend para invalidar el refresh token en la BD.
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Error al cerrar sesión en el backend:", error);
    } finally {
      // Limpiamos todo en el frontend sin importar el resultado del backend.
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  },

  /**
   * @function checkAuthStatus
   * @description Revalida la sesión en segundo plano con el backend.
   * Se llama al cargar la aplicación.
   */
  checkAuthStatus: async () => {
    // Si no hay token de acceso, no hay nada que verificar.
    if (!localStorage.getItem("accessToken")) {
      return set({ isAuthenticated: false, user: null, isLoading: false });
    }

    try {
      // Usamos /auth/me que está protegido y nos devuelve los datos del usuario si el token es válido.
      const response = await api.get("/auth/me");

      // Si la petición es exitosa, el usuario está validado. Sincronizamos por si sus datos (ej. rol) han cambiado.
      set({
        isAuthenticated: true,
        user: response.data.user,
        isLoading: false,
      });
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      // Si la petición a /auth/me falla (ej. 401), significa que la sesión ya no es válida.
      console.error(
        "Fallo en la verificación de la sesión, cerrando sesión localmente."
      );
      get().logout(); // Llamamos a la acción de logout para limpiar todo.
    }
  },
}));
