/**
 * @file axios.js
 * @module Config
 * @description Configuración centralizada de la instancia de Axios para la aplicación.
 * Este módulo crea una instancia de Axios con interceptores preconfigurados para manejar
 * automáticamente la autenticación (añadiendo el token JWT a las cabeceras) y la renovación
 * de tokens de acceso expirados sin interrumpir la experiencia del usuario.
 * @requires axios
 */
import axios from "axios";

/**
 * @type {Array<object>}
 * @description Una cola para almacenar temporalmente las peticiones que fallaron con un error 401
 * mientras se está intentando renovar el accessToken. Cada elemento en la cola es una Promesa
 * con sus funciones `resolve` y `reject`.
 */
let failedQueue = [];

/**
 * @type {boolean}
 * @description Una bandera para prevenir múltiples llamadas simultáneas al endpoint de refresh.
 * Si ya se está refrescando el token, las nuevas peticiones fallidas se encolan en lugar de iniciar un nuevo proceso de refresh.
 */
let isRefreshing = false;

/**
 * @function processQueue
 * @description Procesa todas las peticiones encoladas. Si la renovación del token fue exitosa,
 * reintenta cada petición con el nuevo token. Si falló, rechaza todas las peticiones encoladas.
 * @param {Error|null} error - El error ocurrido durante la renovación del token, o null si fue exitosa.
 * @param {string|null} token - El nuevo accessToken, o null si la renovación falló.
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * @const {AxiosInstance} api
 * @description Instancia de Axios preconfigurada para ser utilizada en toda la aplicación.
 */
const api = axios.create({
  baseURL: "http://192.168.1.202:3000",
  withCredentials: true,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

/**
 * @description Interceptor de Petición (Request).
 * Se ejecuta ANTES de que cada petición sea enviada. Su principal misión es leer el
 * `accessToken` del `localStorage` y adjuntarlo a la cabecera `Authorization` como un Bearer Token.
 */
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    // La lógica de CSRF puede seguir aquí si la necesitas, aunque con tokens en Authorization es menos común.
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * @description Interceptor de Respuesta (Response).
 * Se ejecuta DESPUÉS de recibir una respuesta de la API. Su principal misión es interceptar
 * los errores `401 Unauthorized` (que usualmente indican un token de acceso expirado) y manejar
 * el flujo de renovación de token de forma transparente para el usuario.
 */
api.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa (2xx), no hace nada.
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Solo actúa si el error es 401 y no es una petición que ya se está reintentando.
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) return Promise.reject(error);

          // Llamamos al endpoint de refresh con el refreshToken
          const response = await api.post("/auth/refresh", { refreshToken });
          const { accessToken: newAccessToken } = response.data;

          // Guardamos el nuevo accessToken
          localStorage.setItem("accessToken", newAccessToken);

          // Aplicamos el nuevo token a la cabecera de la petición original
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Procesamos la cola de peticiones que estaban esperando
          processQueue(null, newAccessToken);

          // Reintentamos la petición original
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          // Si el refresh falla, es un error de autenticación definitivo.
          // Limpiamos todo y redirigimos.
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user"); // También limpiar el usuario
          window.location.href = "/auth-denegado"; // Redirige al usuario
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Si ya se está refrescando, ponemos la petición en cola
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject: (err) => {
            reject(err);
          },
        });
      });
    }

    // Para cualquier otro error (404, 500, etc.), simplemente lo propaga.
    return Promise.reject(error);
  }
);

export default api;
