/**
 * Script independiente para probar la conexión a la base de datos
 * usando la instancia de Sequelize definida en db.config.js
 */
import sequelize from "./src/config/db.config.js";

/**
 * @async
 * @function testSequelizeConnection
 * @description Intenta autenticar la conexión de Sequelize a MariaDB.
 * @returns {void}
 */
async function testSequelizeConnection() {
  try {
    console.log("Intentando autenticar la conexión a MariaDB...");

    // El método authenticate() de Sequelize prueba la conexión
    await sequelize.authenticate();

    console.log("✅ Conexión a MariaDB establecida exitosamente.");

    const [results] = await sequelize.query("SELECT 1+1 as result");
    console.log(
      "Resultado de la consulta de prueba (SELECT 1+1):",
      results[0].result
    );
  } catch (err) {
    console.error("❌ Error de conexión a la base de datos:", err.message);
  } finally {
    // Cierra la conexión al finalizar el script
    await sequelize.close();
    console.log("Conexión de Sequelize cerrada.");
  }
}

testSequelizeConnection();
