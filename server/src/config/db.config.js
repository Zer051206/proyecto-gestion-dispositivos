// server/src/config/db.config.js
import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env" }); // Asegura la carga de .env desde la raíz

/**
 * Configuración de conexión a la base de datos MariaDB
 * Se utiliza el prefijo DB_MARIA_ para evitar conflictos.
 */
const config = {
  // Desarrollo (valores por defecto)
  development: {
    username: process.env.DB_MARIA_USER,
    password: process.env.DB_MARIA_PASSWORD,
    database: process.env.DB_MARIA_NAME,
    host: process.env.DB_MARIA_HOST || "localhost",
    port: process.env.DB_MARIA_PORT || 3306,
    dialect: "mariadb",
    dialectOptions: {
      connectTimeout: 60000,
    },
    logging: false, // Desactiva los logs de SQL. Cámbialo a console.log para debugging
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  // Producción (puedes añadir más configuraciones aquí)
  production: {
    // ... configuración de producción
  },
};

export default config;
