/**
 * @file userMiddleware.js
 * @module Middlewares
 * @description Middleware de autorización para proteger rutas que requieren privilegios de Encargado.
 * Este es un alias o una versión específica del middleware de autorización para usuarios con el rol 'Encargado'.
 * @requires ../utils/customErrors.js
 * @requires ../config/logger.js
 */
import { ForbiddenError } from "../utils/customErrors.js";
import logger from "../config/logger.js";

/**
 * @function isEncargado
 * @description Middleware de Express para verificar si el usuario autenticado tiene el rol de 'Encargado'.
 * Este middleware debe ser utilizado **después** del `authMiddleware`, ya que depende de que el objeto `req.user`
 * haya sido previamente poblado con la información del usuario verificado.
 * @param {import('express').Request} req - El objeto de la solicitud de Express, se espera que contenga `req.user`.
 * @param {import('express').Response} res - El objeto de la respuesta de Express.
 * @param {import('express').NextFunction} next - La función callback para pasar el control al siguiente middleware.
 * @returns {void} Llama a `next()` para continuar si el usuario es un Encargado, o a `next(error)` si no lo es.
 */
const isEncargado = (req, res, next) => {
  // Se asume que `authMiddleware` se ejecutó antes y adjuntó el objeto `user` a la petición.
  if (req.user?.rol !== "Encargado") {
    // Se registra una advertencia de seguridad si un usuario no autorizado (ej. un Admin) intenta acceder.
    logger.warn(
      {
        userId: req.user?.id_usuario,
        userRole: req.user?.rol,
        ip: req.ip,
        route: req.originalUrl,
      },
      "Intento de acceso no autorizado a una ruta de Encargado."
    );
    // Se detiene la cadena de middlewares y se pasa un error de "Prohibido".
    return next(
      new ForbiddenError(
        "Acceso denegado. Esta acción es solo para encargados."
      )
    );
  }

  // Si el chequeo es exitoso, se pasa el control al siguiente middleware o al controlador de la ruta.
  next();
};

export default isEncargado;
