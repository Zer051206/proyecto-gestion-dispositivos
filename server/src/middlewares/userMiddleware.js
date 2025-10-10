import { ForbiddenError } from "../utils/customErrors.js";

/**
 * Middleware para verificar si el usuario autenticado tiene el rol de 'Encargado'.
 * Debe usarse SIEMPRE DESPUÉS del 'authMiddleware'.
 */
const isEncargado = (req, res, next) => {
  if (req.user?.rol !== "Encargado") {
    return next(
      new ForbiddenError(
        "Acceso denegado. Esta acción es solo para encargados."
      )
    );
  }

  next();
};

export default isEncargado;
