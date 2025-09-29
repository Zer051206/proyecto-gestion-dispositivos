import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Cargar variables de entorno si no están cargadas
dotenv.config({ path: "../../.env" });

// Configuración de Sequelize usando variables de entorno
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mariadb",
    dialectOptions: {
      connectTimeout: 60000,
    },
    logging: false, // Desactiva logs de SQL por defecto
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export default sequelize;
