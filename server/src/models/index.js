import { Sequelize, DataTypes } from "sequelize";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Define __filename y __dirname para entornos ES Modules (mjs/js con type: module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importa la configuración de la base de datos
import dbConfig from "../config/db.config.js";

const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];

// Inicializa el objeto db que se exportará
const db = {};

let sequelize;

// ----------------------------------------------------------------------
// 1. Conexión a la Base de Datos
// ----------------------------------------------------------------------
if (config.use_env_variable) {
  // Caso de usar una variable de entorno como URL completa (ej. producción)
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Caso estándar de desarrollo (usando nombre, usuario, contraseña)
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// ----------------------------------------------------------------------
// 2. Carga Dinámica de Modelos
// ----------------------------------------------------------------------

// Lee todos los archivos en el directorio actual (src/models)
const modelFiles = fs
  .readdirSync(__dirname)
  // Filtra y solo considera archivos .js que no sean 'index.js'
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== path.basename(__filename) &&
      file.slice(-3) === ".js"
    );
  });

for (const file of modelFiles) {
  const modelPath = path.join(__dirname, file);

  // Importa el modelo (función que define la tabla)
  const modelModule = await import(modelPath);
  const model = modelModule.default(sequelize, DataTypes);

  // Añade el modelo al objeto db usando su nombre
  db[model.name] = model;
}

// ----------------------------------------------------------------------
// 3. Ejecución de Asociaciones
// ----------------------------------------------------------------------

// Si el modelo tiene un método 'associate', lo ejecuta
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ----------------------------------------------------------------------
// 4. Exportación
// ----------------------------------------------------------------------

db.sequelize = sequelize; // Exporta la instancia de conexión
db.Sequelize = Sequelize; // Exporta la clase Sequelize (por si es necesaria)

export default db;
