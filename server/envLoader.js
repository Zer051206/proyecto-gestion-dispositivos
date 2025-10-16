/**
 * @file envLoader.js
 * @module Config
 * @description Script de inicialización para cargar las variables de entorno desde un archivo .env.
 * Este módulo debe ser importado **una única vez** y como la **primera línea absoluta** en el punto de entrada
 * principal del servidor (ej. server.js) para asegurar que `process.env` esté poblado antes de que cualquier
 * otra parte de la aplicación (como la configuración de la base de datos) intente acceder a estas variables.
 * @requires dotenv
 * @requires path
 * @requires url
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// --- Obtención de la Ruta del Directorio en ES Modules ---

/**
 * @description En el sistema de módulos de ECMAScript (ESM), las variables globales como `__dirname` no existen.
 * Este bloque de código recrea esa funcionalidad de forma segura y compatible.
 * `import.meta.url` contiene la URL del archivo actual.
 * `fileURLToPath` convierte esa URL a una ruta de sistema de archivos absoluta.
 * `path.dirname` extrae el nombre del directorio de esa ruta.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuración de Dotenv ---

/**
 * @description Le indica a la librería `dotenv` que cargue el archivo .env.
 * Se utiliza `path.resolve` para construir una ruta absoluta al archivo .env que se encuentra
 * en el directorio padre (`../`), es decir, en la raíz del proyecto del servidor.
 * Esto hace que el script funcione sin importar desde dónde se ejecute.
 * @param {object} options - Objeto de configuración para dotenv.
 * @param {string} options.path - La ruta explícita al archivo .env.
 */
dotenv.config({ path: path.resolve(__dirname, "../.env") });
