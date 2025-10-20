/**
 * @file peripheralController.js
 * @module Controllers
 * @description Controlador para los endpoints de gestión de periféricos (CRUD).
 * Maneja las solicitudes HTTP para obtener, crear y actualizar periféricos, delegando la
 * lógica de negocio a `peripheralService`.
 * @requires ../schemas/peripheralSchema.js
 * @requires ../services/peripheralService.js
 * @requires ../config/logger.js
 */
import * as peripheralService from "../services/peripheralService.js";
import {
  createPeripheralSchema,
  updatePeripheralSchema,
} from "../schemas/peripheralSchema.js";
import logger from "../config/logger.js";

/**
 * @async
 * @function getAllPeripherals
 * @description Obtiene una lista de todos los periféricos.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 */
export const getAllPeripherals = async (req, res, next) => {
  try {
    const allPeripherals = await peripheralService.fetchAllPeripherals();
    return res.status(200).json(allPeripherals);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function getPeripheralById
 * @description Obtiene un periférico específico por su ID.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 */
export const getPeripheralById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const peripheral = await peripheralService.getPeripheralById(id);
    return res.status(200).json(peripheral);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function createPeripheral
 * @description Crea uno o más periféricos nuevos.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 */
export const createPeripheral = async (req, res, next) => {
  try {
    const ip_usuario = req.ip;
    const user = req.user;
    const createValidateData = createPeripheralSchema.parse(req.body);

    logger.info(
      { userId: user.id_usuario, count: createValidateData.length },
      "Solicitud para crear nuevo(s) periférico(s)"
    );

    const newPeripheral = await peripheralService.createPeripheral(
      createValidateData,
      ip_usuario,
      user
    );
    return res.status(201).json({
      message: "Periferico creado exitosamente.",
      success: true,
      peripheral: newPeripheral,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function updatePeripheral
 * @description Actualiza la información de un periférico existente.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 */
export const updatePeripheral = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateValidateData = updatePeripheralSchema.parse(req.body);

    logger.info(
      { userId: req.user.id_usuario, targetPeripheralId: id },
      "Solicitud para actualizar periférico"
    );

    const updatedPeripheral = await peripheralService.updatePeripheral(
      updateValidateData,
      id
    );
    return res.status(200).json({
      message: "Periferico actualizado exitosamente",
      success: true,
      peripheral: updatedPeripheral,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function statePeripheral
 * @description Cambia el estado (activo/inactivo) de un periférico.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 */
export const statePeripheral = async (req, res, next) => {
  try {
    const { id } = req.params;
    const id_usuario = req.user.id_usuario;
    const ip_usuario = req.ip;
    const updateData = req.body;

    logger.info(
      {
        userId: id_usuario,
        targetPeripheralId: id,
        newState: updateData.estado_periferico,
      },
      "Solicitud para cambiar estado de periférico"
    );

    const peripheral = await peripheralService.statePeripheral(
      id,
      updateData,
      id_usuario,
      ip_usuario
    );
    return res.status(200).json({
      message: "Periferico dado de baja exitosamente",
      success: true,
      peripheral: peripheral,
    });
  } catch (error) {
    next(error);
  }
};
