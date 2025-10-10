import "./envLoader.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import db from "./src/models/index.js";
import authRoutes from "./src/routes/authRoutes.js";
import cookieParser from "cookie-parser";
import catalogueRoutes from "./src/routes/catalogueRoutes.js";
import deviceRoutes from "./src/routes/deviceRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import peripheralRoutes from "./src/routes/peripheralRoutes.js";
import apiRoutes from "./src/routes/apiRoutes.js";
import isAdmin from "./src/middlewares/AdminMiddleware.js";
import operationCenterRoutes from "./src/routes/operationCenterRoutes.js";
import authMiddleware from "./src/middlewares/authMiddleware.js";
import errorHandler from "./src/middlewares/errorMiddleware.js";

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
app.set("trust proxy", 1);

// 1. Rutas Públicas (Autenticación y Catálogos)
app.use("/auth", authRoutes);
app.use("/api", catalogueRoutes);

// 2. Rutas Privadas (Requieren estar logueado)
// Primero, aplicamos el portero general a todo lo que venga después
app.use("/api", authMiddleware, limiter);

// 3. Sub-sección de Rutas para Admins
// Después del portero general, aplicamos el guardia VIP 'isAdmin'
app.use("/api", isAdmin, [userRoutes, operationCenterRoutes]);

// 4. Rutas para Todos los Roles Autenticados (Admins y Encargados)
app.use("/api", [deviceRoutes, peripheralRoutes, apiRoutes]);

app.use(errorHandler);

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
