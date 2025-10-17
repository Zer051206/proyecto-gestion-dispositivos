/**
 * @file authRoutes.js
 * @module Routes
 * @description Define las rutas específicas para la autenticación de usuarios.
 * Este enrutador maneja las operaciones de inicio de sesión, renovación de token, cierre de sesión
 * y verificación de la sesión actual.
 * @requires express
 * @requires express-rate-limit
 * @requires ../controllers/authController.js
 * @requires ../middlewares/authMiddleware.js
 */
import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as authController from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @const {object} loginLimiter
 * @description Middleware de `rate-limit` configurado específicamente para los endpoints de login y refresh.
 * Limita el número de intentos desde una misma IP para mitigar ataques de fuerza bruta.
 * La configuración es más estricta en producción.
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Ventana de tiempo de 15 minutos
  max: process.env.NODE_ENV === "production" ? 10 : 1000, // Límite de peticiones por IP
  message: {
    success: false,
    message: "Demasiados intentos. Por favor, intenta de nuevo más tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- RUTAS PÚBLICAS DE AUTENTICACIÓN ---

/**
 * @route   POST /auth/login
 * @description Autentica a un usuario con su correo y contraseña.
 * @access Public
 * @middleware loginLimiter - Aplica un límite de peticiones para seguridad.
 * @param {string} req.body.correo - El correo electrónico del usuario.
 * @param {string} req.body.password - La contraseña del usuario.
 * @returns {object} 200 - Objeto con los datos del usuario y los tokens de acceso y refresco.
 * @returns {Error} 401 - Si las credenciales son incorrectas o la cuenta no existe.
 */
router.post("/login", loginLimiter, authController.loginUser);

/**
 * @route   POST /auth/refresh
 * @description Renueva un `accessToken` expirado utilizando un `refreshToken` válido.
 * @access Public
 * @middleware loginLimiter - Aplica un límite de peticiones para seguridad.
 * @param {string} req.body.refreshToken - El token de refresco del usuario.
 * @returns {object} 200 - Objeto con el nuevo `accessToken` y los datos del usuario.
 * @returns {Error} 401 - Si el `refreshToken` es inválido o ha expirado.
 */
router.post("/refresh", loginLimiter, authController.refreshToken);

/**
 * @route   POST /auth/logout
 * @description Cierra la sesión del usuario invalidando el `refreshToken` en la base de datos.
 * @access Public
 * @param {string} req.body.refreshToken - El token de refresco a invalidar.
 * @returns {object} 200 - Un mensaje de éxito.
 */
router.post("/logout", authController.logoutUser);

// --- RUTA PROTEGIDA DE AUTENTICACIÓN ---

/**
 * @route   GET /auth/me
 * @description Endpoint protegido para verificar la validez de un `accessToken` existente.
 * Si el token es válido, devuelve los datos del usuario asociado. Es ideal para la
 * revalidación de sesión al cargar la aplicación en el frontend.
 * @access Private
 * @middleware authMiddleware - Asegura que solo usuarios autenticados puedan acceder.
 * @returns {object} 200 - Objeto confirmando la autenticación y los datos del usuario.
 * @returns {Error} 401 - Si el token no es válido o ha expirado.
 */
router.get("/me", authMiddleware, authController.getMe);

export default router;
