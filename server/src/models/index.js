/**
 * @file index.js
 * @module models
 * @description Configuración principal de Sequelize. Inicializa la conexión,
 * carga los modelos dinámicamente y establece las asociaciones.
 */
import { Sequelize, DataTypes } from "sequelize";
import path from "path";
import fs from "fs";
// CAMBIO 1: Importamos las dos utilidades de 'url' que necesitamos
import { fileURLToPath, pathToFileURL } from "url";

// Define __filename y __dirname para entornos ES Modules (sin cambios)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importa la configuración de la base de datos (sin cambios)
import dbConfig from "../config/db.config.js";

const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];

// --- (TODA LA LÓGICA DE 'connectWithRetry' HASTA AQUÍ NO CAMBIA) ---

const MAX_RETRIES = 5;
const DELAY_MS = 5000;
const db = {};
let sequelize;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const connectWithRetry = async () => {
  let retries = 0;
  const defineOptions = {
    freezeTableName: true,
    underscored: true,
  };
  while (retries < MAX_RETRIES) {
    try {
      console.log(
        `Intentando conexión a la base de datos (Intento ${
          retries + 1
        }/${MAX_RETRIES})...`
      );
      if (config.use_env_variable) {
        sequelize = new Sequelize(process.env[config.use_env_variable], {
          ...config,
          define: defineOptions,
        });
      } else {
        sequelize = new Sequelize(
          config.database,
          config.username,
          config.password,
          { ...config, define: defineOptions }
        );
      }
      await sequelize.authenticate();
      console.log("Conexión a la base de datos establecida exitosamente.");
      return;
    } catch (error) {
      retries++;
      console.error(`ERROR de conexión (Intento ${retries}): ${error.message}`);
      if (retries === MAX_RETRIES) {
        console.error(
          "Máximo de reintentos alcanzado. Fallo al conectar con la base de datos."
        );
        throw error;
      }
      console.log(
        `Esperando ${DELAY_MS / 1000} segundos antes de reintentar...`
      );
      await delay(DELAY_MS);
    }
  }
};

try {
  await connectWithRetry();
} catch (error) {
  console.error("Error fatal al conectar con la base de datos:", error);
  process.exit(1);
}

if (!sequelize) {
  console.error("Sequelize no se pudo inicializar correctamente.");
  process.exit(1);
}

// ----------------------------------------------------------------------
// 2. Carga Dinámica de Modelos (AQUÍ ESTÁ LA CORRECCIÓN)
// ----------------------------------------------------------------------

const findModelFiles = (dir) => {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = [...files, ...findModelFiles(fullPath)];
    } else if (
      item.name.indexOf(".") !== 0 &&
      item.name !== path.basename(__filename) &&
      item.name.slice(-3) === ".js"
    ) {
      files.push(fullPath);
    }
  }
  return files;
};

const modelFiles = findModelFiles(__dirname);
console.log(`Cargando ${modelFiles.length} modelos...`);

for (const file of modelFiles) {
  try {
    // CAMBIO 2: Convertimos la ruta del archivo a una URL válida para 'import'
    const modelURL = pathToFileURL(file).href;

    // CAMBIO 3: Usamos la nueva URL para importar el módulo
    const modelModule = await import(modelURL);

    // El resto de la lógica no cambia
    if (!modelModule.default || typeof modelModule.default !== "function") {
      console.warn(
        `⚠️  El archivo ${file} no exporta una función por defecto. Omitiendo...`
      );
      continue;
    }
    const model = modelModule.default(sequelize, DataTypes);
    db[model.name] = model;
    console.log(`✓ Modelo ${model.name} cargado correctamente`);
  } catch (error) {
    console.error(`✗ Error al cargar el modelo ${file}:`, error.message);
    throw error;
  }
}

// ----------------------------------------------------------------------
// 3. Ejecución de Asociaciones (Sin cambios)
// ----------------------------------------------------------------------

console.log("Estableciendo asociaciones entre modelos...");
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    try {
      db[modelName].associate(db);
      console.log(`✓ Asociaciones de ${modelName} establecidas`);
    } catch (error) {
      console.error(
        `✗ Error al establecer asociaciones de ${modelName}:`,
        error.message
      );
      throw error;
    }
  }
});

// ----------------------------------------------------------------------
// 4. Exportación (Sin cambios)
// ----------------------------------------------------------------------

db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log(
  `\n🎉 Sequelize inicializado correctamente con ${
    Object.keys(db).length - 2
  } modelos\n`
);

export default db;
