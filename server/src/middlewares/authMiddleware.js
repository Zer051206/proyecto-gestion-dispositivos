import { verifyAccessToken } from "../utils/tokenUtils.js";
import * as userRepository from "../repositories/userRepository.js";
import {
  InvalidTokenError,
  AccountDisabledError,
} from "../utils/customErrors.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new InvalidTokenError(
        "Acceso no autorizado. Token no proporcionado."
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    // Buscamos un USUARIO por su ID
    const user = await userRepository.findById(decoded.id_usuario);

    if (!user || !user.activo) {
      throw new AccountDisabledError(
        "Acceso denegado. La cuenta no existe o ha sido desactivada."
      );
    }

    // Adjuntamos la información del usuario a la petición
    req.user = {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
      id_centro_operacion: user.id_centro_operacion,
    };
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
