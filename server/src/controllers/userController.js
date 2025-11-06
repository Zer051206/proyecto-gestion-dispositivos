/**
 * @file userController.js
 * @module Controllers
 * @description Controlador para los endpoints de gestión de usuarios (CRUD).
 * Maneja las solicitudes HTTP para obtener, crear y actualizar usuarios, delegando la
 * lógica de negocio a `userService`. Estas rutas son de acceso exclusivo para administradores.
 * @requires ../services/userService.js
 * @requires ../schemas/userSchema.js
 * @requires ../config/logger.js
 */
import * as userService from "../services/userService.js";
import logger from "../config/logger.js";

/**
 * @async
 * @function getAllUsers
 * @description Obtiene una lista de todos los usuarios del sistema.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await userService.getAllUsers();
    return res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function getUserById
 * @description Obtiene un usuario específico por su ID.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function createUser
 * @description Crea uno o más usuarios nuevos en el sistema.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 */
export const createUser = async (req, res, next) => {
  try {
    const id_admin = req.user.id_usuario;
    const ip_admin = req.ip;
    const createValidateData = req.body;

    logger.info(
      { adminId: id_admin, count: createValidateData.length },
      "Solicitud para crear nuevo(s) usuario(s)"
    );
    const newUser = await userService.createUser(
      id_admin,
      createValidateData,
      ip_admin
    );
    return res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function updateUser
 * @description Actualiza la información de un usuario existente.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id_usuario } = req.params;
    const updateValidateData = req.body;

    logger.info(
      { adminId: req.user.id_usuario, targetUserId: id_usuario },
      "Solicitud para actualizar usuario"
    );

    const updatedUser = await userService.updateUser(
      updateValidateData,
      id_usuario
    );
    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function stateUser
 * @description Cambia el estado (activo/inactivo) de un usuario.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 */
export const stateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const id_admin = req.user.id_usuario;
    const ip_admin = req.ip;
    const updateData = req.body;

    logger.info(
      { adminId: id_admin, targetUserId: id, newState: updateData.activo },
      "Solicitud para cambiar estado de usuario"
    );

    const updatedUser = await userService.stateUser(
      id,
      updateData,
      id_admin,
      ip_admin
    );
    return res.status(200).json({
      message: "Usuario actualizado exitosamente.",
      success: true,
      User: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
