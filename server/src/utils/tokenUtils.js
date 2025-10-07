import jwt from "jsonwebtoken";
import crypto from "crypto";
import jwtConfig from "../config/jwt.config.js"; // 1. Importamos la configuración

/**
 * @function generateAccessToken
 * @description Genera un accessToken para el usuario.
 */
export const generateAccessToken = (userPayload) => {
  // 2. Usamos los valores de la configuración
  return jwt.sign(userPayload, jwtConfig.accessSecret, {
    expiresIn: jwtConfig.accessExpiresIn,
  });
};

/**
 * @function verifyAccessToken
 * @description Verifica el token de acceso del usuario.
 */
export const verifyAccessToken = (token) => {
  // 3. Usamos el secreto de la configuración
  return jwt.verify(token, jwtConfig.accessSecret);
};

// Las otras funciones no necesitan cambios
export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

export const getRefreshTokenExpiration = () => {
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + 7);
  return expiration;
};
