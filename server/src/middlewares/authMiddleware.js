/**
 * @file authMiddleware.js
 * @description Middleware de autenticación principal conectado a la arquitectura de repositorios.
 */
import { verifyAccessToken, generateAccessToken } from "../utils/tokenUtils.js";
// 1. Importamos desde los REPOSITORIOS, no de los modelos antiguos.
import * as userRepository from "../repositories/userRepository.js";
import * as refreshTokenRepository from "../repositories/refreshTokenRepository.js";
import {
  InvalidTokenError,
  AccountDisabledError,
} from "../utils/customErrors.js";
// 2. Importamos las opciones de cookies centralizadas.
import {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "../config/cookie.config.js";

const authMiddleware = async (req, res, next) => {
  let accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  let decoded = null;

  try {
    // El flujo de verificación del Access Token no cambia, está perfecto.
    if (accessToken) {
      try {
        decoded = verifyAccessToken(accessToken);
      } catch (e) {
        if (e.name !== "TokenExpiredError") {
          throw e;
        }
        accessToken = null; // Fuerza el flujo de renovación
      }
    }

    // El flujo de Renovación ahora usa el repositorio.
    if (!accessToken) {
      if (!refreshToken) {
        throw new InvalidTokenError(
          "Acceso no autorizado. Token no proporcionado."
        );
      }

      // 3. La llamada ahora usa el refreshTokenRepository importado.
      const tokenData = await refreshTokenRepository.findValidRefreshToken(
        refreshToken
      );
      if (!tokenData) {
        throw new InvalidTokenError("Sesión expirada o token inválido.");
      }

      const newAccessToken = generateAccessToken({
        id_usuario: tokenData.id_usuario,
        correo: tokenData.correo,
        rol: tokenData.rol,
      });

      // Usamos las opciones de cookie importadas.
      res.cookie("accessToken", newAccessToken, ACCESS_TOKEN_COOKIE_OPTIONS);

      decoded = verifyAccessToken(newAccessToken);
    }

    // 4. Lógica de verificación de usuario activo
    // Usamos el userRepository para obtener el usuario completo desde la BD.
    const user = await userRepository.findById(decoded.id_usuario);

    // Verificamos dos cosas: que el usuario exista Y que esté activo.
    if (!user || !user.activo) {
      throw new AccountDisabledError(
        "Acceso denegado. La cuenta no existe o ha sido desactivada."
      );
    }

    // 5. Autenticación Exitosa: adjuntamos la info del usuario a la petición.
    req.user = {
      id_usuario: user.id_usuario,
      correo: user.correo,
      rol: user.rol,
    };
    next();
  } catch (error) {
    // El manejo de errores al fallar la autenticación no cambia, está perfecto.
    res.clearCookie("accessToken", ACCESS_TOKEN_COOKIE_OPTIONS);
    res.clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS);
    next(error);
  }
};

export default authMiddleware;
