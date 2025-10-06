// src/config/api.js
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// El interceptor de PETICIÓN (para CSRF) sigue siendo perfecto y no cambia.
api.interceptors.request.use(
  (config) => {
    const csrfRequiredMethods = ["post", "put", "patch", "delete"];
    const method = config.method.toLowerCase();
    if (csrfRequiredMethods.includes(method)) {
      const csrfToken = Cookies.get("csrf-token");
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// El interceptor de RESPUESTA ahora es mucho más simple.
api.interceptors.response.use(
  (response) => response, // Peticiones exitosas pasan sin más.
  (error) => {
    const status = error.response?.status;

    // Si el error es 401 (y no es una petición de login/registro que falló),
    // significa que la sesión ha expirado definitivamente (ni el refresh token funcionó).
    // Es hora de sacar al usuario.
    if (
      status === 401 &&
      !error.config.url.includes("/auth/login") &&
      !error.config.url.includes("/auth/register")
    ) {
      // Redirigimos a una página que le informa al usuario que su sesión terminó.
      window.location.href = "/auth-denegado";
    }

    // Para cualquier otro error, simplemente lo dejamos pasar para que sea manejado
    // por el 'catch' de la llamada original (ej. en el hook de Formik).
    return Promise.reject(error);
  }
);

export default api;
