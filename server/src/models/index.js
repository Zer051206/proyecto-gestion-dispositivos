/**
 * @file index.js
 * @module models
 * @description Configuración principal de Sequelize. Inicializa la conexión,
 * carga los modelos dinámicamente y establece las asociaciones.
 * Incluye lógica de reintento (retry) para la conexión a la base de datos.
 */
import { Sequelize, DataTypes } from "sequelize";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Define __filename y __dirname para entornos ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importa la configuración de la base de datos
import dbConfig from "../config/db.config.js";

const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];

// Parámetros de reintento de conexión
const MAX_RETRIES = 5; // Intentar 5 veces
const DELAY_MS = 5000; // Esperar 5 segundos entre reintentos

const db = {};
let sequelize;

// Función auxiliar para esperar
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @async
 * @function connectWithRetry
 * @description Intenta establecer la conexión a la base de datos con reintentos
 * en caso de fallo inicial.
 */
const connectWithRetry = async () => {
  let retries = 0;

  // Opciones comunes de definición para todos los modelos
  const defineOptions = {
    freezeTableName: true, // Evita la pluralización automática
    underscored: true, // Usa snake_case para auto-generados (createdAt, updatedAt)
  };

  while (retries < MAX_RETRIES) {
    try {
      console.log(
        `Intentando conexión a la base de datos (Intento ${
          retries + 1
        }/${MAX_RETRIES})...`
      );

      // ----------------------------------------------------------------------
      // 1. Conexión a la Base de Datos
      // ----------------------------------------------------------------------
      if (config.use_env_variable) {
        sequelize = new Sequelize(process.env[config.use_env_variable], {
          ...config,
          define: defineOptions,
        });
      } else {
        // Caso estándar de desarrollo
        sequelize = new Sequelize(
          config.database,
          config.username,
          config.password,
          {
            ...config,
            define: defineOptions,
          }
        );
      }

      // Testea la conexión de inmediato (esto lanzará un error si falla)
      await sequelize.authenticate();
      console.log("Conexión a la base de datos establecida exitosamente.");

      // Si la conexión es exitosa, salimos del bucle
      return;
    } catch (error) {
      retries++;
      console.error(`ERROR de conexión (Intento ${retries}): ${error.message}`);

      if (retries === MAX_RETRIES) {
        // Si se alcanza el máximo, lanzamos el error y terminamos la aplicación
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

// Ejecutamos la función de conexión con reintento (usando top-level await)
try {
  await connectWithRetry();
} catch (error) {
  console.error("Error fatal al conectar con la base de datos:", error);
  process.exit(1); // Termina el proceso con código de error
}

// Validación de seguridad: si sequelize no se inicializó, no continuar
if (!sequelize) {
  console.error("Sequelize no se pudo inicializar correctamente.");
  process.exit(1);
}

// ----------------------------------------------------------------------
// 2. Carga Dinámica de Modelos
// ----------------------------------------------------------------------

// LÓGICA MEJORADA CON BÚSQUEDA RECURSIVA
const findModelFiles = (dir) => {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      // Si es un directorio, busca dentro de él
      files = [...files, ...findModelFiles(fullPath)];
    } else if (
      item.name.indexOf(".") !== 0 &&
      item.name !== path.basename(__filename) &&
      item.name.slice(-3) === ".js"
    ) {
      // Si es un archivo .js válido, agrégalo
      files.push(fullPath);
    }
  }
  return files;
};

// Llama a la nueva función para obtener todos los archivos de modelo
const modelFiles = findModelFiles(__dirname);

console.log(`Cargando ${modelFiles.length} modelos...`);

for (const file of modelFiles) {
  try {
    const modelPath = path.join(__dirname, file);

    // Importa el modelo (función que define la tabla)
    const modelModule = await import(modelPath);

    // Validación: verifica que el modelo tenga export default
    if (!modelModule.default || typeof modelModule.default !== "function") {
      console.warn(
        `⚠️  El archivo ${file} no exporta una función por defecto. Omitiendo...`
      );
      continue;
    }

    const model = modelModule.default(sequelize, DataTypes);

    // Añade el modelo al objeto db usando su nombre
    db[model.name] = model;
    console.log(`✓ Modelo ${model.name} cargado correctamente`);
  } catch (error) {
    console.error(`✗ Error al cargar el modelo ${file}:`, error.message);
    throw error;
  }
}

// ----------------------------------------------------------------------
// 3. Ejecución de Asociaciones
// ----------------------------------------------------------------------

console.log("Estableciendo asociaciones entre modelos...");

// Si el modelo tiene un método 'associate', lo ejecuta
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
      throw error; // Si las asociaciones son críticas, debe fallar
    }
  }
});

// ----------------------------------------------------------------------
// 4. Exportación
// ----------------------------------------------------------------------

db.sequelize = sequelize; // Exporta la instancia de conexión
db.Sequelize = Sequelize; // Exporta la clase Sequelize

console.log(
  `\n🎉 Sequelize inicializado correctamente con ${
    Object.keys(db).length - 2
  } modelos\n`
);

export default db;
