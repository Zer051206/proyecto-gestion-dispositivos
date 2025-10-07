// src/routes/authRoutes.js

import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as authController from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 10 : 1000,
  message: {
    success: false,
    message: "Demasiados intentos. Por favor, intenta de nuevo más tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- Rutas Públicas de Autenticación ---
router.post("/register", loginLimiter, authController.registerAdmin);
router.post("/login", loginLimiter, authController.loginAdmin);
router.post("/refresh", loginLimiter, authController.refreshToken);
router.post("/logout", authController.logoutAdmin);

// --- Ruta Protegida de Autenticación ---
// Esta es la única ruta 'GET' que necesitamos. Sirve para validar una sesión existente.
router.get("/me", authMiddleware, authController.getMe);

export default router;
