/**
 * @file test.db.js
 * @module Database/Utils
 * @description Script de utilidad independiente para verificar la conexión a la base de datos.
 * Este script intenta autenticar la conexión de Sequelize y ejecuta una consulta simple
 * para confirmar que la comunicación con la base de datos MariaDB es funcional.
 * Es una herramienta de diagnóstico útil para depurar problemas de conexión.
 * @requires ./src/config/db.config.js
 * @usage node test.db.js
 */

// Importa la instancia de Sequelize directamente desde el archivo de configuración.
import sequelize from "./src/config/db.config.js";

/**
 * @async
 * @function testSequelizeConnection
 * @description Orquesta el proceso de prueba de conexión.
 * Intenta autenticar, ejecuta una consulta de prueba, y maneja los errores,
 * asegurándose de cerrar la conexión al final.
 * @returns {void} No devuelve ningún valor, solo imprime mensajes en la consola.
 */
async function testSequelizeConnection() {
  try {
    console.log("Intentando autenticar la conexión a MariaDB...");

    /**
     * @description El método .authenticate() de Sequelize es un "ping" a la base de datos.
     * Intenta establecer una conexión y la cierra inmediatamente. Si tiene éxito, la promesa se resuelve.
     * Si falla (ej. por credenciales incorrectas, host inaccesible), la promesa se rechaza.
     */
    await sequelize.authenticate();

    console.log("✅ Conexión a MariaDB establecida exitosamente.");

    /**
     * @description Ejecuta una consulta SQL cruda para una verificación adicional.
     * Esto confirma que no solo podemos conectar, sino también ejecutar comandos.
     */
    const [results] = await sequelize.query("SELECT 1+1 as result");
    console.log(
      "Resultado de la consulta de prueba (SELECT 1+1):",
      results[0].result
    );
  } catch (err) {
    // Si authenticate() o query() fallan, se captura el error aquí.
    console.error("❌ Error de conexión a la base de datos:", err.message);
  } finally {
    /**
     * @description El bloque finally se ejecuta siempre, haya habido un error o no.
     * Es el lugar perfecto para asegurarse de cerrar la conexión y liberar recursos,
     * evitando que el script se quede colgado.
     */
    await sequelize.close();
    console.log("Conexión de Sequelize cerrada.");
  }
}

// Ejecuta la función de prueba.
testSequelizeConnection();
