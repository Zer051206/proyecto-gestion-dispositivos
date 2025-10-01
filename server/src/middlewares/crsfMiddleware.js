/**
 * @file csrfMiddleware.js
 * @module csrfMiddleware
 * @description Implementa la protección contra ataques Cross-Site Request Forgery (CSRF)
 * utilizando el patrón "Double Submit Cookie". Define el middleware principal de validación.
 */

import { InvalidTokenError } from "../utils/customErrors.js";
import crypto from "crypto";

// ----------------------------------------------------------------------
// 1. Constantes y Configuración
// ----------------------------------------------------------------------

/**
 * @const {Array<string>} CSRF_EXCLUDED_PATHS
 * @description Rutas que deben ser EXCLUIDAS de la verificación CSRF. Solo se excluye el POST de inicio de sesión.
 */
// 🚩 AJUSTE: Solo el POST de login se excluye de la verificación del token en el HEADER.
const CSRF_EXCLUDED_PATHS = ["/api/v1/auth/login"];

/**
 * @const {string} CSRF_TOKEN_HEADER
 * @description Nombre del encabezado HTTP donde se espera recibir el token CSRF (ej: 'x-csrf-token').
 */
const CSRF_TOKEN_HEADER = "x-csrf-token";

/**
 * @const {string} CSRF_TOKEN_COOKIE
 * @description Nombre de la cookie donde se almacena el token CSRF.
 */
const CSRF_TOKEN_COOKIE = "csrf-token";

// ----------------------------------------------------------------------
// 2. Utilidades
// ----------------------------------------------------------------------

/**
 * @function generateCsrfToken
 * @description Genera un token CSRF seguro mediante bytes aleatorios.
 * @returns {string} El token CSRF en formato hexadecimal.
 */
const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// ----------------------------------------------------------------------
// 3. Middlewares
// ----------------------------------------------------------------------

/**
 * @function csrfMiddleware
 * @description Middleware principal para la protección CSRF (Double Submit Cookie).
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar el control al siguiente middleware/ruta.
 * @returns {void} Llama a `next()` si la verificación es exitosa.
 * @throws {InvalidTokenError} Si los tokens no existen o no coinciden.
 */
const csrfMiddleware = (req, res, next) => {
  const method = req.method;
  const originalUrl = req.originalUrl;

  // 🚩 Simplificación de la lógica de exclusión: solo se excluye el método POST en la ruta de login.
  const isLoginPost =
    method === "POST" &&
    CSRF_EXCLUDED_PATHS.some((path) => originalUrl.includes(path));

  // A. Manejar Métodos Seguros (GET, HEAD, OPTIONS)
  if (
    method === "GET" ||
    method === "HEAD" ||
    method === "OPTIONS" ||
    isLoginPost
  ) {
    // Si no existe la cookie CSRF, la creamos y la enviamos al cliente.
    if (!req.cookies[CSRF_TOKEN_COOKIE]) {
      const token = generateCsrfToken();
      res.cookie(CSRF_TOKEN_COOKIE, token, {
        httpOnly: false, // Debe ser accesible por JavaScript para leerlo
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }
    return next();
  }

  // B. Manejar Métodos que Modifican el Estado (POST, PUT, DELETE, PATCH, etc.)
  try {
    // 1. Obtener tokens
    const tokenFromHeader = req.headers[CSRF_TOKEN_HEADER];
    const tokenFromCookie = req.cookies[CSRF_TOKEN_COOKIE];

    // 2. Verificar existencia y coincidencia
    if (
      !tokenFromHeader ||
      !tokenFromCookie ||
      tokenFromHeader !== tokenFromCookie
    ) {
      throw new InvalidTokenError("Token CSRF inválido o faltante.");
    }
    next();
  } catch (error) {
    // Pasar el error al manejador de errores de Express
    next(error);
  }
};

/**
 * @function csrfTokenMiddleware
 * @description Middleware específico de ruta para generar o renovar el token CSRF
 * y enviarlo en el cuerpo de la respuesta al frontend (ej. tras un login exitoso).
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar el control al siguiente middleware.
 * @returns {void} Envía una respuesta JSON con el token CSRF.
 */
export const csrfTokenMiddleware = (req, res, _next) => {
  // Renueva o usa el token existente
  const token = req.cookies[CSRF_TOKEN_COOKIE] || generateCsrfToken();

  // Establece la cookie (para el patrón Double Submit Cookie)
  res.cookie(CSRF_TOKEN_COOKIE, token, {
    httpOnly: false, // Accesible por JavaScript
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  // Envía el token al frontend para que lo ponga en el HEADER
  res.status(200).json({ csrfToken: token });
};

export default csrfMiddleware;
