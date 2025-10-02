/**
 * @file tokenUtils.js
 * @module tokenUtils
 * @description Colección de funciones de utilidad para la generación, verificación y gestión de la expiración de Access Tokens (JWT) y Refresh Tokens.
 */
import jwt from "jsonwebtoken";
import crypto from "crypto";

/**
 * @function generateAccessToken
 * @description Esta funcion se encarga generar un accessToken para el usuario.
 * @param {Object} user - Objeto del usuario que contiene la información para el payload del token.
 * @param {number} user.id_usuario - ID único del usuario (Usado para el campo 'userId' en el payload).
 * @param {string} user.correo - Correo electrónico del usuario (Usado para el campo 'correo' en el payload).
 * @param {string} user.rol - Rol o perfil del usuario (Usado para el campo 'rol' en el payload).
 * @returns {string} AccessToken firmado con expiración de 15 minutos.
 */
export const generateAccessToken = (user) => {
  const payload = {
    id_usuario: user.id_usuario,
    correo: user.correo,
    rol: user.rol,
  };

  // El secreto JWT debe cargarse desde las variables de entorno para seguridad.
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

/**
 * @function generateRefreshToken
 * @description Esta funcion se encarga de generar un refreshToken para el usuario.
 * @returns {string} RefreshToken generado como una cadena hexadecimal aleatoria de 64 bytes.
 */
export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

/**
 * @function verifyAccessToken
 * @description Esta funcion se encarga de verificar que el token de acceso del usuario es válido.
 * @param {string} token - El token de acceso JWT a verificar.
 * @returns {object} Decoded payload - La carga útil (payload) decodificada del token si es válido.
 * @returns {number} Decoded payload.id_usuario - ID del usuario.
 * @returns {string} Decoded payload.rol - Rol del usuario.
 * @throws {Error} Si el token es inválido o ha expirado.
 */
export const verifyAccessToken = (token) => {
  // Verifica y decodifica el token usando el secreto
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * @function getRefreshTokenExpiration
 * @description Esta funcion se encarga de generar una expiracion de 7 dias al refreshToken.
 * @returns {Date} Plazo de expiracion - Un objeto Date que representa la fecha y hora de expiración (+7 días a partir de ahora).
 */
export const getRefreshTokenExpiration = () => {
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + 7);
  return expiration;
};
