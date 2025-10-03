import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import db from "./src/models/index.js";
import authRoutes from "./src/routes/authRoutes.js";
import assignmentRoutes from "./src/routes/operationCenterRoutes.js";
import csrfMiddleware from "./src/middlewares/crsfMiddleware.js";
import cookieParser from "cookie-parser";
import catalogueRoutes from "./src/routes/catalogueRoutes.js";
import personRoutes from "./src/routes/personRoutes.js";
import deviceRoutes from "./src/routes/deviceRoutes.js";

dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

const app = express();

// Middleware de Seguridad
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    exposedHeaders: ["set-cookie"],
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message:
    "Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos.",
});

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(csrfMiddleware);
app.set("trust proxy", true);

app.use("/auth", authRoutes);
app.use("/", limiter, assignmentRoutes);
app.use("/personas", limiter, personRoutes);
app.use("/", limiter, deviceRoutes);
app.use("/catalogo", limiter, catalogueRoutes);
const PORT = process.env.PORT || 3000;

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
