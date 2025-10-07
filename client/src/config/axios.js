import axios from "axios";

// Almacenará las peticiones fallidas mientras se renueva el token
let failedQueue = [];
let isRefreshing = false;

const api = axios.create({
  // Volvemos a apuntar directamente al backend, ya no usamos proxy
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true, // Lo mantenemos por si usamos cookies para otras cosas (ej. CSRF)
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

/**
 * @description Interceptor de Petición: Se ejecuta ANTES de cada llamada a la API.
 * Su misión es tomar el accessToken del localStorage y añadirlo a la cabecera.
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
 * @description Interceptor de Respuesta: Se ejecuta DESPUÉS de recibir una respuesta.
 * Su misión es interceptar los errores 401 (token expirado) y intentar renovarlo.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Solo actuamos si el error es 401 y no es un reintento
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
          window.location.href = "/auth-denegado";
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

    return Promise.reject(error);
  }
);

// Función para procesar la cola de peticiones
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

export default api;
