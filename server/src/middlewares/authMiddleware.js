/**
 * @file authMiddleware.js
 * @module Middlewares
 * @description Middleware de autenticación principal para proteger las rutas de la API.
 * Se encarga de verificar la validez del JSON Web Token (JWT) de acceso proporcionado
 * en la cabecera de la solicitud.
 * @requires ../utils/tokenUtils.js
 * @requires ../repositories/userRepository.js
 * @requires ../utils/customErrors.js
 */
import { verifyAccessToken } from "../utils/tokenUtils.js";
import * as userRepository from "../repositories/userRepository.js";
import {
  InvalidTokenError,
  AccountDisabledError,
} from "../utils/customErrors.js";

/**
 * @function authMiddleware
 * @description Middleware de Express que protege las rutas privadas. Realiza los siguientes pasos:
 * 1. Extrae el token JWT de la cabecera 'Authorization'.
 * 2. Valida la firma y la expiración del token.
 * 3. Busca al usuario en la base de datos usando el ID contenido en el token.
 * 4. Verifica que el usuario exista y que su cuenta esté activa.
 * 5. Si todo es correcto, adjunta la información del usuario al objeto `req` para que las
 * siguientes funciones en la cadena (otros middlewares o controladores) tengan acceso a ella.
 * 6. Si alguna verificación falla, pasa un error al manejador de errores centralizado.
 * @param {object} req - El objeto de la solicitud de Express.
 * @param {object} res - El objeto de la respuesta de Express.
 * @param {Function} next - La función callback para pasar el control al siguiente middleware.
 * @async
 */
const authMiddleware = async (req, res, next) => {
  try {
    // 1. Extraer el token de la cabecera.
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new InvalidTokenError(
        "Acceso no autorizado. Token no proporcionado."
      );
    }

    const token = authHeader.split(" ")[1];

    // 2. Verificar el token. Si es inválido o ha expirado, jwt.verify lanzará un error.
    const decoded = verifyAccessToken(token);

    // 3. Buscar al usuario en la base de datos para asegurar que todavía existe.
    const user = await userRepository.findById(decoded.id_usuario);

    // 4. Verificar que el usuario exista y esté activo.
    if (!user || !user.activo) {
      throw new AccountDisabledError(
        "Acceso denegado. La cuenta no existe o ha sido desactivada."
      );
    }

    const permissionsList = user.Permissions
      ? user.Permissions.map((p) => p.nombre)
      : [];

    // 5. Adjuntar la información esencial del usuario a la petición.
    // Esto enriquece el objeto `req` para que esté disponible en los controladores posteriores.
    req.user = {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
      id_centro_operacion: user.id_centro_operacion,
      permisos: permissionsList,
    };
    // Si todas las verificaciones son exitosas, pasamos el control al siguiente middleware o controlador.
    next();
  } catch (error) {
    // Si ocurre cualquier error durante el proceso, lo pasamos al manejador de errores central.
    next(error);
  }
};

export default authMiddleware;
