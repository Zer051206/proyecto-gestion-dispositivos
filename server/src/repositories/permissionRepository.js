/**
 * @file permissionRepository.js
 * @module Repositories
 * @description Capa de repositorio para la gestión de Permisos y las relaciones de Usuarios-Permisos.
 * Proporciona métodos para verificar la existencia de permisos asignados a un usuario.
 */
import { Op } from "sequelize";
import logger from "../config/logger.js";
import db from "../models/index.js";
const { User, Permission } = db;

/**
 * @async
 * @function hasPermission
 * @description Verifica si un usuario (por ID) tiene un permiso específico (por nombre canónico).
 * Esta función es crítica para la validación de acceso en la capa de servicio.
 * * @param {number} userId - El ID del usuario.
 * @param {string} permissionName - El nombre canónico del permiso (ej. 'CAN_SIGN_TI_ANALYSIS').
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. para transacciones).
 * @returns {Promise<boolean>} Retorna `true` si el usuario tiene el permiso activo, `false` en caso contrario.
 */
export const hasPermission = async (userId, permissionName, options = {}) => {
  try {
    const userWithPermission = await User.findOne({
      attributes: ["id_usuario"], // Solo necesitamos saber si existe
      where: { id_usuario: userId },
      include: [
        {
          model: Permission,
          as: "Permissions",
          through: { attributes: [] },
          required: true,
          where: {
            nombre: permissionName,
            activo: true,
          },
        },
      ],
      ...options,
    });

    return userWithPermission !== null;
  } catch (error) {
    logger.error(
      `[permissionRepository.hasPermission] Error al verificar permiso: ${error.message}`
    );
    // En caso de error de base de datos, lo más seguro es denegar el acceso.
    return false;
  }
};

/**
 * @async
 * @function findPermissionsByUserId
 * @description Obtiene todos los nombres de permisos activos asignados a un usuario.
 * (Útil para cargar permisos en la sesión de autenticación).
 * * @param {number} userId - El ID del usuario.
 * @returns {Promise<Array<string>>} Un array de nombres de permisos (ej. ['CAN_SIGN_TI_ANALYSIS', ...]).
 */
export const findPermissionsByUserId = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: [],
      include: [
        {
          model: Permission,
          as: "Permissions",
          through: { attributes: [] },
          required: true,
          where: { activo: true },
        },
      ],
    });

    if (!user) {
      return [];
    }

    return user.Permissions.map((permission) => permission.nombre);
  } catch (error) {
    logger.error(
      `[permissionRepository.findPermissionsByUserId] Error al buscar permisos: ${error.message}`
    );
    return [];
  }
};

/**
 * @async
 * @function assignPermissionsToUser
 * @description Asigna una lista de permisos canónicos a un usuario en una única operación.
 * @param {number} userId - El ID del usuario.
 * @param {Array<string>} permissionNames - Array de nombres canónicos de permisos a asignar.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (REQUIERE { transaction: t }).
 * @throws {Error} Si uno o más permisos requeridos no se encuentran en la base de datos.
 */
export const assignPermissionsToUser = async (
  userId,
  permissionNames,
  options = {}
) => {
  // 1. Si no hay permisos que asignar, termina la función
  if (!permissionNames || permissionNames.length === 0) {
    return;
  }

  try {
    // 2. Buscar los IDs de los permisos por sus nombres
    const permissions = await Permission.findAll({
      attributes: ["permiso_id", "nombre"], // Necesitamos el ID y el nombre para la verificación
      where: {
        nombre: { [Op.in]: permissionNames },
        activo: true,
      },
      ...options,
    });

    // 3. VERIFICACIÓN DE CONSISTENCIA (Manejo del Error)
    if (permissions.length !== permissionNames.length) {
      const foundNames = permissions.map((p) => p.nombre);
      const missingPermissions = permissionNames.filter(
        (name) => !foundNames.includes(name)
      );

      const errorMessage = `Error de configuración: No se encontraron los siguientes permisos canónicos en la DB: ${missingPermissions.join(
        ", "
      )}.`;
      logger.error(
        `[permissionRepository.assignPermissionsToUser] ${errorMessage}`
      );
      // Lanzar un error para forzar el rollback de la transacción de creación del usuario
      throw new Error(errorMessage);
    }

    // 4. Obtener el objeto del usuario (requerido para usar el método setPermissions)
    // Se asume que el usuario ya existe en esta etapa de la transacción
    const user = await User.findByPk(userId, {
      attributes: ["id_usuario"],
      ...options,
    });

    if (user) {
      const permissionIds = permissions.map((p) => {
        p.toJSON();
        return p.permiso_id;
      });

      // 5. Asignar los permisos (Método de asociación many-to-many de Sequelize)
      // Esto inserta las filas en la tabla pivote (e.g., usuarios_permisos)
      await user.setPermissions(permissionIds, { ...options, force: false });
    }
  } catch (error) {
    // Si no es un error de consistencia, loguear y propagar
    if (!error.message.startsWith("Error de configuración")) {
      logger.error(
        `[permissionRepository.assignPermissionsToUser] Error DB al asignar permisos: ${error.message}`
      );
    }
    throw error;
  }
};
