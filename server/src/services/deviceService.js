/**
 * @file deviceService.js
 * @module Services
 * @description Capa de servicio que contiene toda la lógica de negocio para la gestión de Equipos (CRUD).
 * @requires ../models/index.js
 * @requires ../repositories/deviceRepository.js
 * @requires ../repositories/logRepository.js
 * @requires ../repositories/decommissionRepository.js
 * @requires ../utils/customErrors.js
 * @requires ../config/logger.js
 */
import db from "../models/index.js";
import * as deviceRepository from "../repositories/deviceRepository.js";
import * as logRepository from "../repositories/logRepository.js";
import * as decomissionRepository from "../repositories/decommissionRepository.js";
import { AlreadyDesactivated, NotFoundError } from "../utils/customErrors.js";
import logger from "../config/logger.js";

/**
 * @async
 * @function fetchAllDevices
 * @description Obtiene una lista de todos los equipos.
 * @returns {Promise<Array<object>>}
 */
export const fetchAllDevices = async () => {
  const allDevices = await deviceRepository.findAll();
  return allDevices;
};

/**
 * @async
 * @function getDeviceById
 * @description Obtiene un equipo específico por su ID.
 * @param {number} id - El ID del equipo a buscar.
 * @returns {Promise<object>}
 * @throws {NotFoundError} Si el equipo no se encuentra.
 */
export const getDeviceById = async (id) => {
  const device = await deviceRepository.findById(id);
  if (!device) throw new NotFoundError(`Equipo con ID ${id} no encontrado.`);
  return device;
};

/**
 * @async
 * @function createDevice
 * @description Crea uno o más equipos nuevos en una transacción, aplicando la lógica de rol.
 * @param {Array<object>} devicesData - Datos de los equipos a crear.
 * @param {object} user - El objeto del usuario autenticado que realiza la creación.
 * @param {string} ip_usuario - La dirección IP del usuario.
 * @returns {Promise<Array<object>>}
 */
export const createDevice = async (devicesData, user, ip_usuario) => {
  return db.sequelize.transaction(async (t) => {
    const creationPromises = devicesData.map(async (deviceData) => {
      let deviceForDb = {
        ...deviceData,
        id_usuario_creador: user.id_usuario,
      };

      if (user.rol === "Encargado") {
        deviceForDb.id_centro_operacion = user.id_centro_operacion;
      }

      const newDevice = await deviceRepository.create(deviceForDb, {
        transaction: t,
      });

      await logRepository.create(
        {
          accion: "CREAR_EQUIPO",
          id_usuario: user.id_usuario,
          descripcion: `Se creó el equipo con serial '${newDevice.serial}' (ID: ${newDevice.id_equipo}).`,
          ip_usuario: ip_usuario,
        },
        { transaction: t }
      );

      return newDevice;
    });

    const createdDevices = await Promise.all(creationPromises);

    logger.info(
      { userId: user.id_usuario, count: createdDevices.length },
      "Equipo(s) creado(s) exitosamente."
    );

    return createdDevices;
  });
};

/**
 * @async
 * @function updateDevice
 * @description Actualiza los datos de un equipo existente.
 * @param {number} id_equipo - El ID del equipo a actualizar.
 * @param {object} updateData - Los datos a modificar.
 * @returns {Promise<object>}
 * @throws {NotFoundError} Si el equipo no se encuentra.
 */
export const updateDevice = async (updateValidateData, id_equipo) => {
  const deviceExists = await deviceRepository.findById(id_equipo);
  if (!deviceExists) {
    throw new NotFoundError(`Equipo con ID ${id_equipo} no encontrado.`);
  }
  const updatedDevice = await deviceRepository.update(
    id_equipo,
    updateValidateData
  );
  return updatedDevice;
};

/**
 * @async
 * @function stateDevice
 * @description Cambia el estado (activo/inactivo) de un equipo.
 * @param {number} id_equipo - El ID del equipo a modificar.
 * @param {object} updateData - Objeto con el nuevo estado (ej. { estado_equipo: false }).
 * @param {number} id_usuario - El ID del usuario que realiza la acción.
 * @param {string} ip_usuario - La IP del usuario.
 * @returns {Promise<object>}
 * @throws {NotFoundError} Si el equipo no se encuentra.
 * @throws {AppError} Si se intenta aplicar un estado que el equipo ya tiene.
 */
export const stateDevice = async (
  id_equipo,
  updateData,
  id_usuario,
  ip_usuario
) => {
  return db.sequelize.transaction(async (t) => {
    const deviceDb = await deviceRepository.findById(id_equipo, {
      transaction: t,
    });

    if (updateData !== undefined) {
      if (updateData.estado_equipo === deviceDb.estado_equipo) {
        const message = deviceDb.estado_equipo
          ? "El equipo ya se encuentra activo"
          : "El equipo ya está dado de baja";
        throw new AlreadyDesactivated(message);
      }
    }

    const updatedDevice = await deviceRepository.update(
      id_equipo,
      { estado_equipo: updateData.estado_equipo },
      {
        transaction: t,
      }
    );

    if (updateData.estado_equipo === false) {
      await decomissionRepository.create(
        {
          id_equipo: id_equipo,
          id_usuario: id_usuario,
        },
        { transaction: t }
      );

      await logRepository.create(
        {
          accion: "DAR_DE_BAJA_EQUIPO",
          id_usuario: id_usuario,
          descripcion: `Se dio de baja al equipo con serial '${deviceDb.serial}' (ID: ${id_equipo}).`,
          ip_usuario: ip_usuario,
        },
        { transaction: t }
      );
      logger.info(
        { userId: id_usuario, deviceId: id_equipo },
        "Equipo dado de baja exitosamente."
      );
    } else {
      await logRepository.create(
        {
          accion: "REACTIVAR_EQUIPO",
          id_usuario: id_usuario,
          descripcion: `Se reactivo el equipo con serial '${deviceDb.serial}' (ID: ${id_equipo}).`,
          ip_usuario: ip_usuario,
        },
        { transaction: t }
      );
      logger.info(
        { userId: id_usuario, deviceId: id_equipo },
        "Equipo reactivado exitosamente."
      );
    }

    return updatedDevice;
  });
};
