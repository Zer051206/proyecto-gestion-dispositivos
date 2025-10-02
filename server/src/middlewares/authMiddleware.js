/**
 * @file authMiddleware.js
 * @module authMiddleware
 * @description Middleware de autenticación principal. Se encarga de verificar el Access Token,
 * y en caso de que este haya expirado, intenta usar el Refresh Token para generar uno nuevo
 * también verifica que el usuario asociado esté activo.
 */

import { verifyAccessToken, generateAccessToken } from "../utils/tokenUtils.js";
import * as userModel from "../models/userModel.js";
import * as refreshTokenModel from "../models/refreshTokenModel.js";
import {
  InvalidTokenError,
  AccountDisabledError,
} from "../utils/customErrors.js";

// Opciones estandarizadas para las Cookies (Aplica la lógica de SameSite)
const ACCESS_TOKEN_OPTIONS = {
  httpOnly: true, // No accesible por JavaScript (Seguridad XSS)
  path: "/",
  secure: process.env.NODE_ENV === "production", // Solo se envía sobre HTTPS en producción
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Necesario para Front/Back en dominios separados
  maxAge: 15 * 60 * 1000, // Duración del Access Token (15 minutos)
};

const REFRESH_TOKEN_OPTIONS = {
  httpOnly: true,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días de duración, por ejemplo
};

/**
 * @async
 * @function authMiddleware
 * @description Verifica la autenticación del usuario a través de cookies (Access Token y Refresh Token).
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar el control al siguiente middleware.
 * @returns {void} Llama a `next()` si la autenticación es exitosa, o a `next(error)` si falla.
 */
const authMiddleware = async (req, res, next) => {
  let accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  let decoded = null;

  try {
    // 1. Intenta verificar el Access Token
    if (accessToken) {
      // Intenta decodificar el token sin preocuparse por la expiración aquí
      try {
        decoded = verifyAccessToken(accessToken);
      } catch (e) {
        // Si falla la verificación por expiración, intentaremos renovarlo con el RT
        if (e.name !== "TokenExpiredError") {
          throw e; // Lanza cualquier otro error de token (mal formato, inválido)
        }
        accessToken = null; // Fuerza el flujo de renovación
      }
    }

    // 2. Flujo de Renovación (Si el Access Token no existe o expiró)
    if (!accessToken) {
      if (!refreshToken) {
        throw new InvalidTokenError(
          "Acceso no autorizado. Token no proporcionado o sesión finalizada."
        );
      }

      // 2a. Verificar y obtener datos del Refresh Token de la base de datos
      const tokenData = await refreshTokenModel.findValidRefreshToken(
        refreshToken
      );
      if (!tokenData) {
        // Si el RT no existe o está marcado como revocado/expirado en DB
        throw new InvalidTokenError(
          "Sesión expirada o token inválido. Por favor, inicia sesión nuevamente."
        );
      }

      // 2b. Generar nuevo Access Token y establecer cookie
      const newAccessToken = generateAccessToken({
        id_usuario: tokenData.id_usuario,
        correo: tokenData.correo,
        rol: tokenData.rol,
      });

      // Establecer el nuevo Access Token en la respuesta
      res.cookie("accessToken", newAccessToken, ACCESS_TOKEN_OPTIONS);

      // Decodificar el nuevo token para usar los datos del usuario
      decoded = verifyAccessToken(newAccessToken);
    }

    // 3. Verificar el estado del usuario (usando el ID del token decodificado)
    // Se usa 'id_usuario' por consistencia con la generación del token
    const user = await userModel.checkIfUserIsActive(decoded.id_usuario);
    if (!user) {
      throw new AccountDisabledError(
        "Acceso denegado. La cuenta no está activada o no existe."
      );
    }

    // 4. Autenticación Exitosa: adjunta la información del usuario
    req.user = {
      id_usuario: decoded.id_usuario, // Ajustado a id_usuario
      correo: decoded.correo,
      rol: decoded.rol,
    };
    next();
  } catch (error) {
    // 5. Manejo de Errores: Borra cookies si falla la autenticación por seguridad
    res.clearCookie("accessToken", ACCESS_TOKEN_OPTIONS);
    res.clearCookie("refreshToken", REFRESH_TOKEN_OPTIONS); // Limpia el RT

    // Pasa el error al manejador de errores de Express
    next(error);
  }
};

export default authMiddleware;
