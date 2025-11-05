/**
 * @file server.js
 * @module Server
 * @description Punto de entrada principal para la aplicación de backend.
 * Este archivo es responsable de:
 * 1. Cargar las variables de entorno.
 * 2. Configurar e inicializar la aplicación Express.
 * 3. Aplicar middlewares de seguridad (CORS, Helmet, Rate Limiting).
 * 4. Orquestar y registrar todas las rutas de la API.
 * 5. Aplicar middlewares de autenticación y autorización.
 * 6. Registrar el manejador de errores centralizado.
 * 7. Conectar a la base de datos e iniciar el servidor.
 */

// 1. Carga de Variables de Entorno (Debe ser la primera importación)
import "./envLoader.js";

// 2. Importaciones de Módulos y Frameworks
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import db from "./src/models/index.js";

// 3. Importaciones de Rutas de la Aplicación
import authRoutes from "./src/routes/authRoutes.js";
import cookieParser from "cookie-parser";
import catalogueRoutes from "./src/routes/catalogueRoutes.js";
import deviceRoutes from "./src/routes/deviceRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import peripheralRoutes from "./src/routes/peripheralRoutes.js";
import apiRoutes from "./src/routes/apiRoutes.js";
import operationCenterRoutes from "./src/routes/operationCenterRoutes.js";
import requirementRoutes from "./src/routes/requirementRoutes.js";

// 4. Importaciones de Middlewares Personalizados
import isAdmin from "./src/middlewares/AdminMiddleware.js";
import authMiddleware from "./src/middlewares/authMiddleware.js";
import errorHandler from "./src/middlewares/errorMiddleware.js";

// --- CONFIGURACIÓN DE LA APLICACIÓN EXPRESS ---

/**
 * @const {string[]} allowedOrigins
 * @description Lista blanca de orígenes permitidos para las peticiones CORS.
 * Permite que el frontend (ej. en localhost:5173) se comunique con esta API.
 */
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

const app = express();

// --- APLICACIÓN DE MIDDLEWARES GLOBALES ---

// Habilita Cross-Origin Resource Sharing (CORS) con opciones de seguridad.
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Permite el envío de cookies y cabeceras de autorización.
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    exposedHeaders: ["set-cookie"],
  })
);

// Habilita un límite de peticiones para prevenir ataques de fuerza bruta.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Ventana de 15 minutos
  max: process.env.NODE_ENV === "production" ? 100 : 5000, // Límite de peticiones por IP
  standardHeaders: true,
  legacyHeaders: false,
  message:
    "Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos.",
});

// Habilita varias cabeceras de seguridad HTTP para proteger la aplicación.
app.use(helmet());
// Habilita el parseo de cuerpos de petición en formato JSON.
app.use(express.json());
// Habilita el parseo de cuerpos de petición con formato URL-encoded.
app.use(express.urlencoded({ extended: true }));
// Habilita el parseo de cookies en las peticiones.
app.use(cookieParser());
// Confía en el primer proxy para obtener la IP real del cliente (útil para el rate limiter).
app.set("trust proxy", 1);

// --- REGISTRO DE RUTAS ---
// El orden de registro es crucial para el funcionamiento de los middlewares.

/**
 * @section Rutas Públicas
 * @description Estas rutas no requieren ningún tipo de autenticación.
 */
app.use("/auth", authRoutes); // Rutas de login, logout, refresh.
app.use("/api", catalogueRoutes); // Rutas para obtener datos de catálogos (ciudades, etc.).

/**
 * @section Rutas Privadas
 * @description Todas las rutas registradas después de esta línea requerirán un token de acceso válido.
 * `authMiddleware` actúa como el "portero general" que verifica la autenticación.
 * `limiter` se aplica solo a las rutas privadas para protegerlas.
 */
app.use("/api", authMiddleware, limiter);

/**
 * @section Rutas para Todos los Roles Autenticados
 * @description Estas rutas pueden ser accedidas tanto por 'Admins' como por 'Encargados'.
 */
app.use("/api", [apiRoutes, deviceRoutes, peripheralRoutes, requirementRoutes]);

/**
 * @section Rutas Exclusivas para Administradores
 * @description El middleware `isAdmin` se aplica a este grupo de rutas, añadiendo una capa
 * adicional de autorización. Un "Encargado" con un token válido será bloqueado aquí.
 */
app.use("/api", isAdmin, [userRoutes, operationCenterRoutes]);

/**
 * @section Manejador de Errores
 * @description Este middleware debe ser el **ÚLTIMO** en ser registrado.
 * Captura cualquier error lanzado en las rutas o middlewares anteriores y formatea
 * una respuesta JSON estandarizada.
 */
app.use(errorHandler);

// --- INICIO DEL SERVIDOR ---

const PORT = process.env.PORT || 3000;

/**
 * @async
 * @function startServer
 * @description Función principal que inicia la aplicación.
 * Primero verifica la conexión a la base de datos y, si tiene éxito,
 * inicia el servidor Express para escuchar peticiones.
 */
async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Conexión a MariaDB establecida exitosamente.");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor Express iniciado en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      "❌ Error al iniciar la aplicación o conectar a la base de datos."
    );
    console.error(`Mensaje de error: ${error.message}`);
    process.exit(1); // Detiene la aplicación si la conexión a la DB falla.
  }
}

startServer();
