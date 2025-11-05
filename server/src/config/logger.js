/**
 * @file logger.js
 * @module Config
 * @description Configuración centralizada para el logger de la aplicación (Pino).
 * El formateo visual se realiza mediante pipe en el script 'dev' de package.json.
 * @requires pino
 */
import pino from "pino";

// En desarrollo, Pino enviará logs en formato JSON directamente a stdout.
// La herramienta 'pino-colada' se encargará del formateo visual a través del pipe.
const options = {
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
};

/**
 * @const {pino.Logger} logger
 * @description Instancia del logger exportada para ser utilizada en toda la aplicación.
 */
const logger = pino(options);

export default logger;
