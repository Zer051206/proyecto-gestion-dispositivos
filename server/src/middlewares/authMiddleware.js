import { verifyAccessToken } from "../utils/tokenUtils.js";
// 1. Importamos el repositorio de ADMIN, no el de usuario
import * as adminRepository from "../repositories/adminRepository.js";
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

    // 2. Buscamos un ADMIN por su ID (decoded.id_admin)
    const admin = await adminRepository.findById(decoded.id_admin);

    // 3. Verificamos que el admin exista y esté activo
    if (!admin || !admin.activo) {
      throw new AccountDisabledError(
        "Acceso denegado. La cuenta de administrador no existe o ha sido desactivada."
      );
    }

    // 4. Adjuntamos la información del admin a la petición, no del usuario
    req.admin = {
      id_admin: admin.id_admin,
      nombre: admin.nombre,
      correo: admin.correo,
    };
    next();
  } catch (error) {
    // Si el token es inválido o expira, el error se pasa al manejador
    next(error);
  }
};

export default authMiddleware;
