import { ForbiddenError } from "../utils/customErrors.js";

/**
 * Middleware para verificar si el usuario autenticado tiene el rol de 'Admin'.
 * Debe usarse SIEMPRE DESPUÉS del 'authMiddleware'.
 */
const isAdmin = (req, res, next) => {
  // Confiamos en que authMiddleware ya nos dejó la información del usuario en req.user
  if (req.user?.rol !== "Admin") {
    // Si no es un admin, lanzamos un error de "Prohibido"
    return next(
      new ForbiddenError(
        "Acceso denegado. Se requieren privilegios de administrador."
      )
    );
  }

  // Si es un admin, le dejamos continuar
  next();
};

export default isAdmin;
