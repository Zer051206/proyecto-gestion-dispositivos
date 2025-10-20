/**
 * @file operationCenterController.js
 * @module Controllers
 * @description Controlador para los endpoints de gestión de Centros de Operación (CRUD).
 * Maneja las solicitudes HTTP para obtener, crear y actualizar centros, delegando la
 * lógica de negocio a `operationCenterService`. Estas rutas son de acceso exclusivo para administradores.
 * @requires ../services/operationCenterService.js
 * @requires ../schemas/operationCenterSchema.js
 * @requires ../config/logger.js
 */
import * as operationCenterService from "../services/operationCenterService.js";
import { createOperationCenterSchema } from "../schemas/operationCenterSchema.js";
import logger from "../config/logger.js";

/**
 * @async
 * @function getAllOperationCenters
 * @description Obtiene una lista de todos los centros de operación.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 */
export const getAllOperationCenters = async (req, res, next) => {
  try {
    const allOperationCenters =
      await operationCenterService.fetchAllOperationCenters();
    return res.status(200).json(allOperationCenters);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function getOperationCenterById
 * @description Obtiene un centro de operación específico por su ID.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 */
export const getOperationCenterById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const operationCenter =
      await operationCenterService.fetchOperationCenterById(id);
    return res.status(200).json(operationCenter);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function createOperationCenter
 * @description Crea uno o más centros de operación nuevos.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 */
export const createOperationCenter = async (req, res, next) => {
  try {
    const ip_usuario = req.ip;
    const id_usuario = req.user.id_usuario;
    const createValidateData = createOperationCenterSchema.parse(req.body);

    logger.info(
      { adminId: id_usuario, count: createValidateData.length },
      "Solicitud para crear nuevo(s) centro(s) de operación"
    );

    const newOperationCenter =
      await operationCenterService.createOperationCenter(
        createValidateData,
        ip_usuario,
        id_usuario
      );
    return res.status(201).json({
      message: "centro de operacion creado con exito.",
      success: true,
      operationCenter: newOperationCenter,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function updateOperationCenter
 * @description Actualiza la información de un centro de operación existente.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 */
export const updateOperationCenter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    logger.info(
      { adminId: req.user.id_usuario, targetCenterId: id },
      "Solicitud para actualizar centro de operación"
    );

    const updatedOperationCenter =
      await operationCenterService.updateOperationCenter(id, updateData);

    return res.status(200).json({
      message: "Centro de operacion actualizado con exito.",
      success: true,
      operationCenter: updatedOperationCenter,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function stateOperationCenter
 * @description Cambia el estado (activo/inactivo) de un centro de operación.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 */
export const stateOperationCenter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const id_usuario = req.user.id_usuario;
    const ip_usuario = req.ip;
    const updateData = req.body;

    logger.info(
      { adminId: id_usuario, targetCenterId: id, newState: updateData.activo },
      "Solicitud para cambiar estado de centro de operación"
    );

    const updatedOperationCenter =
      await operationCenterService.stateOperationCenter(
        id,
        updateData,
        id_usuario,
        ip_usuario
      );

    return res.status(200).json({
      message: "Centro de operacion cerrado exitosamente.",
      success: true,
      operationCenter: updatedOperationCenter,
    });
  } catch (error) {
    next(error);
  }
};
