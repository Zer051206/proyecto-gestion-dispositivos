/**
 * @file deviceController.js
 * @module Controllers
 * @description Controlador para los endpoints de gestión de equipos (CRUD).
 * Maneja las solicitudes HTTP para obtener, crear y actualizar equipos, delegando la
 * lógica de negocio a `deviceService`.
 * @requires ../schemas/deviceSchema.js
 * @requires ../services/deviceService.js
 * @requires ../config/logger.js
 */
import {
  updateDeviceSchema,
  createDeviceSchema,
} from "../schemas/deviceSchema.js";
import * as deviceService from "../services/deviceService.js";
import logger from "../config/logger.js";

/**
 * @async
 * @function getAllDevices
 * @description Obtiene una lista de todos los equipos.
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 */
export const getAllDevices = async (req, res, next) => {
  try {
    const allDevices = await deviceService.fetchAllDevices();
    return res.status(200).json(allDevices);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function getDeviceById
 * @description Obtiene un equipo específico por su ID.
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 */
export const getDeviceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const device = await deviceService.getDeviceById(id);
    return res.status(200).json(device);
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function createDevice
 * @description Crea uno o más equipos nuevos.
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 */
export const createDevice = async (req, res, next) => {
  try {
    const ip_usuario = req.ip;
    const user = req.user;
    const createValidateData = createDeviceSchema.parse(req.body);

    logger.info(
      { userId: user.id_usuario, count: createValidateData.length },
      "Solicitud para crear nuevo(s) equipo(s)"
    );

    const newDevices = await deviceService.createDevice(
      createValidateData,
      user,
      ip_usuario
    );
    return res.status(201).json({
      message: "Equipo registrado exitosamente.",
      success: true,
      devices: newDevices,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function updateDevice
 * @description Actualiza la información de un equipo existente.
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 */
export const updateDevice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateValidateData = updateDeviceSchema.parse(req.body);

    logger.info(
      { userId: req.user.id_usuario, targetDeviceId: id },
      "Solicitud para actualizar equipo"
    );

    const updatedDevice = await deviceService.updateDevice(
      id,
      updateValidateData
    );
    return res.status(200).json({
      message: "Equipo actualizado correctamente",
      success: true,
      device: updatedDevice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function stateDevice
 * @description Cambia el estado (activo/inactivo) de un equipo.
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 */
export const stateDevice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const id_usuario = req.user.id_usuario;
    const ip_usuario = req.ip;
    const updateData = req.body;

    logger.info(
      {
        userId: id_usuario,
        targetDeviceId: id,
        newState: updateData.estado_equipo,
      },
      "Solicitud para cambiar estado de equipo"
    );

    await deviceService.stateDevice(id, updateData, id_usuario, ip_usuario);

    return res.status(200).json({
      message: "Equipo dado de baja exitosamente",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
