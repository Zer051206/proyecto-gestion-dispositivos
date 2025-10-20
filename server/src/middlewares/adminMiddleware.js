/**
 * @file adminMiddleware.js
 * @module Middlewares
 * @description Middleware de autorización para proteger rutas que requieren privilegios de Administrador.
 * @requires ../utils/customErrors.js
 */
import { ForbiddenError } from "../utils/customErrors.js";

/**
 * @function isAdmin
 * @description Middleware de Express para verificar si el usuario autenticado tiene el rol de 'Admin'.
 * Este middleware debe ser utilizado **después** del `authMiddleware`, ya que depende de que el objeto `req.user`
 * haya sido previamente poblado con la información del usuario verificado.
 * @param {object} req - El objeto de la solicitud de Express, se espera que contenga `req.user`.
 * @param {object} res - El objeto de la respuesta de Express.
 * @param {Function} next - La función callback para pasar el control al siguiente middleware.
 * @returns {void} Llama a `next()` para continuar si el usuario es un Admin, o a `next(error)` si no lo es.
 */
const isAdmin = (req, res, next) => {
  // Confiamos en que authMiddleware ya nos dejó la información del usuario en req.user
  if (req.user?.rol !== "Admin") {
    // Si el usuario no existe en la petición o su rol no es 'Admin',
    // se detiene la cadena de middlewares y se pasa un error de "Prohibido" al manejador de errores central.
    return next(
      new ForbiddenError(
        "Acceso denegado. Se requieren privilegios de administrador."
      )
    );
  }

  // Si el chequeo es exitoso, se pasa el control al siguiente middleware o al controlador de la ruta.
  next();
};

export default isAdmin;
