import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import db from "./src/models/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message:
    "Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos.",
});

// Middleware de Seguridad
app.use(limiter);
app.use(helmet());
app.use(cors());
app.use(express.json());

async function startServer() {
  try {
    // Autenticar la conexión a la base de datos
    await db.sequelize.authenticate();
    console.log("✅ Conexión a MariaDB establecida exitosamente.");

    // Iniciar el servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor Express iniciado en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      "❌ Error al iniciar la aplicación o conectar a la base de datos."
    );
    console.error(`Mensaje de error: ${error.message}`);
    // Detiene la aplicación si la DB falla
    process.exit(1);
  }
}

startServer();
