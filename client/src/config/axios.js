/**
 * @file api.js
 * @module AxiosConfig
 * @description Configuración centralizada de la instancia de Axios. Incluye la URL base,
 * credenciales y interceptores para manejar la inyección del token CSRF en
 * peticiones de escritura y la renovación automática del Access Token (refresco de tokens)
 * en caso de recibir una respuesta 401.
 */
import axios from "axios";
import Cookies from "js-cookie";

// Bandera usada en los interceptores de respuesta para evitar bucles infinitos de reintento.
let isRefreshing = false;
let failedQueue = [];

/**
 * @const {object} api
 * @description Instancia de Axios preconfigurada para la comunicación con el backend.
 * Configura la URL base, el envío de cookies (`withCredentials`) y el tipo de contenido.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true, // Importante para enviar cookies (Access Token, Refresh Token, CSRF)
  timeout: 10000, // Tiempo máximo de espera para una respuesta (10 segundos)
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * @description Función para procesar la cola de peticiones fallidas (401) una vez
 * que el token ha sido renovado exitosamente.
 * @param {string} token - El nuevo Access Token. (No se usa directamente aquí ya que Axios gestiona las cookies).
 */
const processQueue = (token) => {
  failedQueue.forEach((prom) => prom.resolve(token));
  failedQueue = [];
};

// ----------------------------------------------------------------------
// Interceptor de Solicitud (Request Interceptor)
// ----------------------------------------------------------------------

/**
 * @description Interceptor que se ejecuta antes de enviar cada petición.
 * Su principal función es inyectar el token CSRF en las cabeceras para
 * métodos que modifican datos (POST, PUT, PATCH, DELETE).
 */
api.interceptors.request.use(
  /**
   * @param {object} config - Objeto de configuración de la solicitud de Axios.
   * @returns {object} La configuración de la solicitud modificada.
   */
  (config) => {
    const csrfRequiredMethods = ["post", "put", "patch", "delete"];
    const method = config.method ? config.method.toLowerCase() : "get";

    if (csrfRequiredMethods.includes(method)) {
      // Usa la librería 'js-cookie' para leer la cookie
      const csrfToken = Cookies.get("csrf-token");

      if (csrfToken) {
        // Inyecta el token en el header que el backend espera
        config.headers["X-CSRF-Token"] = csrfToken;
      } else {
        console.warn(
          "CSRF token missing. This request might be rejected by the server."
        );
      }
    }
    return config;
  },
  /**
   * @param {Error} error - Objeto de error si la configuración de la solicitud falla.
   * @returns {Promise<Error>} Promesa rechazada.
   */
  (error) => {
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------------
// Interceptor de Respuesta (Response Interceptor)
// ----------------------------------------------------------------------

/**
 * @description Interceptor que maneja las respuestas. Implementa la lógica de
 * renovación automática de Access Token (reintento silencioso) cuando
 * se recibe un error 401 (No Autorizado) debido a un token expirado.
 */
api.interceptors.response.use(
  /**
   * @param {object} response - Objeto de respuesta exitosa de la API.
   * @returns {object} La respuesta.
   */
  (response) => {
    return response;
  },
  /**
   * @param {Error} error - Objeto de error de respuesta de la API.
   * @returns {Promise<any>} Promesa que resuelve la petición reintentada o rechaza el error.
   */
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Verificar si la petición fallida fue la de refresco de token
    const isRefreshRequest =
      originalRequest.url && originalRequest.url.includes("/auth/refresh");

    // Condición para intentar el refresco: Error 401, no es una petición de refresco, y no se ha reintentado
    if (status === 401 && !originalRequest._retry && !isRefreshRequest) {
      // 1. Marcar la petición original para que no se reintente más de una vez
      originalRequest._retry = true;

      // 2. Manejo de la cola de peticiones
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Intentar renovar el token de acceso
          await api.post("/auth/refresh");
          isRefreshing = false;
          // Procesar todas las peticiones que se acumularon mientras se renovaba el token
          processQueue();

          // Reintentar la petición original con el nuevo token
          return api(originalRequest);
        } catch (refreshError) {
          // Si la renovación falla (ej: Refresh Token expirado), limpiar cola y redirigir
          isRefreshing = false;
          failedQueue = []; // Limpiar cola

          // Redirigir a la página de inicio de sesión
          window.location.href = "/auth-denegado";

          // Rechazar el error para que la petición original no se complete
          return Promise.reject(error);
        }
      }

      // Si ya hay una renovación en curso, se devuelve una promesa que se resolverá
      // cuando el token se haya renovado (o fallado)
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(api(originalRequest)),
          reject,
        });
      });
    }

    // Si el error es 401 pero es la propia petición de refresh, o si es cualquier otro error, rechazar
    return Promise.reject(error);
  }
);

export default api;
