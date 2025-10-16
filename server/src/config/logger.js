/**
 * @file logger.js
 * @module Config
 * @description Configuración centralizada para el logger de la aplicación (Pino).
 * Este módulo exporta una instancia de logger preconfigurada que se adapta
 * al entorno de ejecución (desarrollo o producción).
 * @requires pino
 */
import pino from "pino";

/**
 * @description Opciones de configuración para el transportador 'pino-pretty'.
 * Se utiliza únicamente en el entorno de desarrollo para formatear los logs
 * en un formato legible para humanos en la consola.
 * @const {object}
 */
const prettyPrintOptions = {
  colorize: true, // Añade colores a la salida
  translateTime: "SYS:dd-mm-yyyy HH:MM:ss", // Formatea la fecha y hora
  ignore: "pid,hostname", // Oculta propiedades innecesarias en desarrollo
};

/**
 * @description Configuración del transportador del logger.
 * En desarrollo, utiliza 'pino-pretty' para una salida legible.
 * En producción, no se define ningún transportador, por lo que Pino escribirá
 * logs en formato JSON directamente a la salida estándar, lo cual es óptimo para el rendimiento.
 * @const {object|undefined}
 */
const transport =
  process.env.NODE_ENV === "development"
    ? pino.transport({
        target: "pino-pretty",
        options: prettyPrintOptions,
      })
    : undefined;

/**
 * @const {pino.Logger} logger
 * @description Instancia del logger exportada para ser utilizada en toda la aplicación.
 * @property {string} level - El nivel mínimo de log a registrar. En desarrollo es 'debug', en producción 'info'.
 */
const logger = pino(
  {
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
  },
  transport
);

export default logger;
