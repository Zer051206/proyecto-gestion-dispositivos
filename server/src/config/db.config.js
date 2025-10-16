/**
 * @file db.config.js
 * @module Config
 * @description Archivo de configuración centralizado para la conexión de Sequelize a la base de datos MariaDB.
 * Lee las credenciales y parámetros de conexión desde las variables de entorno, permitiendo
 * configuraciones distintas para diferentes entornos como desarrollo y producción.
 * @requires dotenv - (Implícitamente, a través de `envLoader.js`)
 */

/**
 * @const {object} config
 * @description Objeto de configuración principal que contiene las definiciones para cada entorno.
 * La clave de cada objeto de entorno (ej. 'development') debe coincidir con el valor de `process.env.NODE_ENV`.
 */
const config = {
  /**
   * @property {object} development - Configuración para el entorno de desarrollo.
   */
  development: {
    /** @type {string} */
    username: process.env.DB_MARIA_USER,
    /** @type {string} */
    password: process.env.DB_MARIA_PASSWORD,
    /** @type {string} */
    database: process.env.DB_MARIA_DATABASE,
    /** @type {string} */
    host: process.env.DB_MARIA_HOST || "localhost",
    /** @type {number} */
    port: process.env.DB_MARIA_PORT || 3306,
    /** @type {string} */
    dialect: "mariadb",

    /**
     * @property {object} dialectOptions - Opciones específicas para el dialecto de MariaDB.
     */
    dialectOptions: {
      connectTimeout: 60000, // Aumenta el tiempo de espera para la conexión a 60 segundos.
    },

    /**
     * @property {boolean|Function} logging
     * @description Controla el logging de las consultas SQL de Sequelize.
     * Se establece en `false` para desactivar el logging en la consola, lo cual es
     * recomendado para producción y para mantener limpias las pruebas.
     * Para depuración, se puede cambiar a `console.log` o `(msg) => logger.debug(msg)`.
     */
    logging: false,

    /**
     * @property {object} pool - Configuración del pool de conexiones de Sequelize.
     * El pool mejora el rendimiento al reutilizar conexiones a la base de datos.
     */
    pool: {
      max: 5, // Número máximo de conexiones en el pool.
      min: 0, // Número mínimo de conexiones en el pool.
      acquire: 30000, // Tiempo máximo (ms) para intentar obtener una conexión antes de lanzar un error.
      idle: 10000, // Tiempo máximo (ms) que una conexión puede estar inactiva antes de ser liberada.
    },
  },

  /**
   * @property {object} production - Configuración para el entorno de producción.
   * Se recomienda usar variables de entorno diferentes y más seguras para este entorno.
   */
  production: {
    username: process.env.DB_MARIA_USER_PROD,
    password: process.env.DB_MARIA_PASSWORD_PROD,
    database: process.env.DB_MARIA_DATABASE_PROD,
    host: process.env.DB_MARIA_HOST_PROD,
    port: process.env.DB_MARIA_PORT_PROD,
    dialect: "mariadb",
    logging: false,
    pool: {
      max: 10,
      min: 1,
      acquire: 60000,
      idle: 20000,
    },
  },
};

export default config;
