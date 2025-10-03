/**
 * @file axiosClient.js
 * @module AxiosClient
 * @description Instancia base de la librería Axios. Este cliente contiene la configuración inicial
 * de la URL base y los encabezados comunes, sin incluir la lógica de autenticación
 * ni los interceptores (a menudo implementados en otra instancia, como 'api.js').
 * @requires axios
 */
import axios from "axios";

/**
 * @const {object} axiosClient
 * @description Instancia base de Axios configurada.
 * Se utiliza para realizar peticiones HTTP a la API sin ninguna lógica de autenticación
 * o manejo de errores avanzada, a diferencia de otras instancias con interceptores.
 *
 * @property {string} baseURL - La URL base de la API, tomada de la variable de entorno VITE_API_URL o por defecto a http://localhost:3000.
 * @property {object} headers - Encabezados HTTP predeterminados (Content-Type: application/json).
 */
const axiosClient = axios.create({
  // La URL base de la API
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",

  // Encabezados comunes que la API pueda necesitar
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
