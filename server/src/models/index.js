/**
 * @file index.js
 * @module Models
 * @description Archivo de inicialización principal para Sequelize.
 * Este módulo es responsable de:
 * 1. Conectar a la base de datos con una lógica de reintentos.
 * 2. Cargar dinámicamente todos los modelos de Sequelize definidos en el directorio.
 * 3. Establecer las asociaciones (relaciones) entre los modelos.
 * 4. Exportar el objeto `db` que contiene la instancia de Sequelize y todos los modelos cargados.
 * @requires sequelize
 * @requires path
 * @requires fs
 * @requires url
 * @requires ../config/db.config.js
 * @requires ../config/logger.js
 */

import { Sequelize, DataTypes } from "sequelize";
import path from "path";
import fs from "fs";
import logger from "../config/logger.js";

// --- CONFIGURACIÓN INICIAL ---

import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dbConfig from "../config/db.config.js";

const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];

// --- 1. LÓGICA DE CONEXIÓN A LA BASE DE DATOS CON REINTENTOS ---

const MAX_RETRIES = 5;
const DELAY_MS = 5000;
const db = {};
let sequelize;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @async
 * @function connectWithRetry
 * @description Intenta establecer la conexión con la base de datos. Si falla, reintenta
 * hasta un número máximo de veces (`MAX_RETRIES`) con un retraso entre cada intento.
 * Esto es crucial en entornos de contenedores (como Docker) donde la aplicación puede
 * iniciarse antes de que la base de datos esté lista.
 * @throws {Error} Si no se puede conectar después de todos los reintentos.
 */
const connectWithRetry = async () => {
  let retries = 0;
  const defineOptions = {
    freezeTableName: true, // Evita que Sequelize pluralice los nombres de las tablas
    underscored: true, // Usa snake_case para las columnas autogeneradas (ej. foreign keys)
  };
  while (retries < MAX_RETRIES) {
    try {
      logger.info(
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
      logger.info("✅ Conexión a la base de datos establecida exitosamente.");

      return;
    } catch (error) {
      retries++;
      logger.error(
        { attempt: retries, error: error.message },
        `ERROR de conexión (Intento ${retries})`
      );

      if (retries === MAX_RETRIES) {
        logger.fatal(
          "Máximo de reintentos alcanzado. Fallo al conectar con la base de datos."
        );
        throw error;
      }
      logger.info(
        `Esperando ${DELAY_MS / 1000} segundos antes de reintentar...`
      );

      await delay(DELAY_MS);
    }
  }
};

try {
  await connectWithRetry();
} catch (error) {
  logger.fatal(
    error,
    "Error fatal al conectar con la base de datos. Saliendo del proceso."
  );
  process.exit(1);
}

if (!sequelize) {
  logger.fatal(
    "Sequelize no se pudo inicializar correctamente. Saliendo del proceso."
  );
  process.exit(1);
}

// --- 2. CARGA DINÁMICA DE MODELOS ---

/**
 * @function findModelFiles
 * @description Busca recursivamente todos los archivos de modelo (.js) en un directorio y sus subdirectorios.
 * @param {string} dir - El directorio inicial para la búsqueda.
 * @returns {string[]} Un array con las rutas absolutas a todos los archivos de modelo encontrados.
 */
const findModelFiles = (dir) => {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = [...files, ...findModelFiles(fullPath)];
    } else if (
      item.name.indexOf(".") !== 0 &&
      item.name !== path.basename(__filename) && // Excluye este mismo archivo (index.js)
      item.name.slice(-3) === ".js"
    ) {
      files.push(fullPath);
    }
  }
  return files;
};

const modelFiles = findModelFiles(__dirname);
logger.info(`Cargando ${modelFiles.length} modelos...`);

// Itera sobre cada archivo de modelo encontrado para importarlo e inicializarlo.
for (const file of modelFiles) {
  try {
    // En ES Modules, se necesita una URL de archivo para la importación dinámica.
    const modelURL = pathToFileURL(file).href;
    const modelModule = await import(modelURL);

    if (!modelModule.default || typeof modelModule.default !== "function") {
      logger.warn(
        `⚠️  El archivo ${file} no exporta una función por defecto. Omitiendo...`
      );
      continue;
    }
    const model = modelModule.default(sequelize, DataTypes);
    db[model.name] = model;
    logger.debug(`✓ Modelo '${model.name}' cargado correctamente.`);
  } catch (error) {
    logger.error(error, `✗ Error al cargar el modelo ${file}`);
    throw error;
  }
}

// --- 3. EJECUCIÓN DE ASOCIACIONES ---

logger.info("Estableciendo asociaciones entre modelos...");
Object.keys(db).forEach((modelName) => {
  // Si el modelo tiene un método 'associate', lo llama.
  if (db[modelName].associate) {
    try {
      db[modelName].associate(db);
      logger.debug(`✓ Asociaciones de '${modelName}' establecidas.`);
    } catch (error) {
      logger.error(
        error,
        `✗ Error al establecer asociaciones de '${modelName}'`
      );
      throw error;
    }
  }
});

// --- 4. EXPORTACIÓN ---

// Añade la instancia de Sequelize y la clase Sequelize al objeto 'db' exportado.
db.sequelize = sequelize;
db.Sequelize = Sequelize;

logger.info(
  `🎉 Sequelize inicializado con ${Object.keys(db).length - 2} modelos.`
);

export default db;
