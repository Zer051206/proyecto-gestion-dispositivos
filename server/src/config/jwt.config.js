/**
 * @file jwt.config.js
 * @module Config
 * @description Archivo de configuración centralizado para los JSON Web Tokens (JWT).
 * Define los secretos y los tiempos de expiración que se utilizarán en toda la aplicación
 * para generar y verificar los tokens de acceso y de refresco.
 * @requires dotenv - (Implícitamente, a través de `envLoader.js`)
 */

/**
 * @const {object} jwtConfig
 * @description Objeto de configuración que encapsula los parámetros para la creación y verificación de JWTs.
 * Es importado por el módulo `tokenUtils.js` para asegurar consistencia.
 */
const jwtConfig = {
  /**
   * @property {string} accessSecret - El secreto utilizado para firmar y verificar los Access Tokens.
   * Se lee desde la variable de entorno `JWT_SECRET` para mantener la seguridad.
   * Debe ser una cadena de texto larga y compleja.
   */
  accessSecret: process.env.JWT_SECRET,

  /**
   * @property {string} accessExpiresIn - El tiempo de vida para un Access Token.
   * Formato: una cadena de texto que describe un lapso de tiempo (ej. "15m", "1h", "2 days").
   */
  accessExpiresIn: "15m",

  /**
   * @property {string} refreshSecret - El secreto utilizado para firmar y verificar los Refresh Tokens.
   * Se lee desde la variable de entorno `JWT_REFRESH_SECRET`. Por seguridad, este secreto
   * debería ser diferente al `accessSecret`.
   */
  refreshSecret: process.env.JWT_REFRESH_SECRET,

  /**
   * @property {string} refreshExpiresIn - El tiempo de vida para un Refresh Token.
   * Usualmente tiene una duración mucho más larga que el Access Token.
   */
  refreshExpiresIn: "7d",
};

export default jwtConfig;
