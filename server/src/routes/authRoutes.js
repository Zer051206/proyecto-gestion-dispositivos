// src/routes/authRoutes.js

import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as authController from "../controllers/authController.js";
import * as refreshTokenRepository from "../repositories/refreshTokenRepository.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { AppError } from "../utils/customErrors.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Demasiados intentos. Por favor, intenta de nuevo más tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- Rutas Públicas de Autenticación ---
router.post("/register", loginLimiter, authController.registerUser);
router.post("/login", loginLimiter, authController.loginUser);
router.post("/refresh", loginLimiter, authController.refreshToken);
router.post("/logout", authController.logoutUser);

/**
 * @route GET /auth/status
 * @description Ruta PÚBLICA para verificar pasivamente el estado de la sesión.
 * NUNCA devuelve un 401. Devuelve { authenticated: true/false }.
 * @access Public
 */
router.get("/status", async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(200).json({ authenticated: false, user: null });
    }

    const tokenData = await refreshTokenRepository.findValidRefreshToken(
      refreshToken
    );
    if (!tokenData) {
      return res.status(200).json({ authenticated: false, user: null });
    }

    // Si el token es válido, devolvemos los datos del usuario.
    return res.status(200).json({
      authenticated: true,
      user: {
        id: tokenData.id_usuario,
        correo: tokenData.correo,
        rol: tokenData.rol,
      },
    });
  } catch {
    // Si hay un error de base de datos, lo pasamos al manejador de errores
    next(new AppError("Error del servidor al verificar la sesión.", 500));
  }
});

/**
 * @route GET /auth/me
 * @description Ruta PROTEGIDA para obtener los datos del usuario actualmente logueado.
 * @access Private
 */
router.get("/me", authMiddleware, authController.getMe);

export default router;
