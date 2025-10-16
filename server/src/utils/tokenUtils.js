/**
 * @file tokenUtils.js
 * @module Utils/Tokens
 * @description Módulo de utilidades para la creación y verificación de JSON Web Tokens (JWT).
 * Centraliza la lógica para generar tokens de acceso y de refresco, así como para
 * verificar la validez de los tokens de acceso, utilizando la configuración centralizada.
 * @requires jsonwebtoken
 * @requires crypto
 * @requires ../config/jwt.config.js
 */
import jwt from "jsonwebtoken";
import crypto from "crypto";
import jwtConfig from "../config/jwt.config.js";

/**
 * @function generateAccessToken
 * @description Genera un nuevo JSON Web Token de acceso (corta duración).
 * Este token contiene el payload del usuario y se firma con el secreto de acceso.
 * @param {object} userPayload - El objeto de datos del usuario a incluir en el token (ej. id, correo, rol).
 * @returns {string} El token de acceso JWT firmado.
 */
export const generateAccessToken = (userPayload) => {
  // Se utilizan el secreto y el tiempo de expiración desde el archivo de configuración.
  return jwt.sign(userPayload, jwtConfig.accessSecret, {
    expiresIn: jwtConfig.accessExpiresIn,
  });
};

/**
 * @function verifyAccessToken
 * @description Verifica la firma y la expiración de un token de acceso.
 * Si el token es válido, devuelve el payload decodificado. Si no, lanza un error.
 * @param {string} token - El token de acceso JWT a verificar.
 * @returns {object|string} El payload decodificado del token si es válido.
 * @throws {JsonWebTokenError|TokenExpiredError} Lanza un error si el token es inválido o ha expirado.
 */
export const verifyAccessToken = (token) => {
  // Se utiliza el secreto de acceso desde el archivo de configuración para la verificación.
  return jwt.verify(token, jwtConfig.accessSecret);
};

/**
 * @function generateRefreshToken
 * @description Genera una cadena de texto aleatoria y segura para ser usada como token de refresco.
 * Utiliza el módulo 'crypto' de Node.js para garantizar una alta entropía.
 * @returns {string} Una cadena hexadecimal de 128 caracteres.
 */
export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

/**
 * @function getRefreshTokenExpiration
 * @description Calcula la fecha de expiración para un nuevo token de refresco.
 * Basado en la configuración, se establece para 7 días en el futuro desde el momento de su creación.
 * @returns {Date} Un objeto de fecha que representa el momento exacto de la expiración.
 */
export const getRefreshTokenExpiration = () => {
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + 7);
  return expiration;
};
