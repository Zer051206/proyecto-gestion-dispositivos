/**
 * @file operationCenterService.js
 * @module Services
 * @description Capa de servicio que contiene toda la lógica de negocio para la gestión de Centros de Operación (CRUD).
 * @requires ../models/index.js
 * @requires ../repositories/operationCenterRepository.js
 * @requires ../repositories/logRepository.js
 * @requires ../utils/customErrors.js
 * @requires ../config/logger.js
 */
import db from "../models/index.js";
import * as operationCenterRepository from "../repositories/operationCenterRepository.js";
import * as logRepository from "../repositories/logRepository.js";
import {
  AlreadyDesactivated,
  DuplicateError,
  NotFoundError,
} from "../utils/customErrors.js";
import logger from "../config/logger.js";

/**
 * @async
 * @function fetchAllOperationCenters
 * @description Obtiene una lista de todos los centros de operación.
 * @returns {Promise<Array<object>>}
 */
export const fetchAllOperationCenters = async () => {
  const allOperationCenters = await operationCenterRepository.findAll();
  return allOperationCenters;
};

/**
 * @async
 * @function fetchOperationCenterById
 * @description Obtiene un centro de operación específico por su ID.
 * @param {number} id - El ID del centro de operación a buscar.
 * @returns {Promise<object>}
 * @throws {NotFoundError} Si el centro no se encuentra.
 */
export const fetchOperationCenterById = async (id) => {
  const operationCenter = await operationCenterRepository.findById(id);
  if (!operationCenter) {
    throw new NotFoundError(
      `El centro de operacion con el ID ${id} no fue encontrado`
    );
  }
  return operationCenter;
};

/**
 * @async
 * @function createOperationCenter
 * @description Crea uno o más centros de operación nuevos en una transacción.
 * @param {Array<object>} operationCentersData - Datos de los centros a crear.
 * @param {number} id_usuario - El ID del admin que realiza la creación.
 * @param {string} ip_usuario - La dirección IP del admin.
 * @returns {Promise<Array<object>>}
 * @throws {DuplicateError} Si uno de los códigos de centro ya existe.
 */
export const createOperationCenter = async (
  operationCentersData,
  ip_usuario,
  id_usuario
) => {
  return db.sequelize.transaction(async (t) => {
    const creationPromises = operationCentersData.map(
      async (operationCenterData) => {
        const { codigo } = operationCenterData;

        const operationCenterDb = await operationCenterRepository.findByCode(
          codigo,
          { transaction: t }
        );

        if (operationCenterDb) {
          logger.warn(
            { adminId: id_usuario, attemptedCode: codigo },
            "Intento de crear centro con código duplicado."
          );

          throw new DuplicateError(
            "Ya existe un centro de operaciones con el mismo código"
          );
        }
        const opCenterData = {
          ...operationCenterData,
          id_admin_creador: id_usuario,
        };

        const newOperationCenter = await operationCenterRepository.create(
          opCenterData,
          { transaction: t }
        );

        await logRepository.create(
          {
            accion: "CREAR_CENTRO_OPERACION",
            ip_usuario: ip_usuario,
            descripcion: `Se creó el centro de operacion con codigo '${newOperationCenter.codigo}' (ID: ${newOperationCenter.id_centro_operacion}).`,
            id_usuario: id_usuario,
          },
          { transaction: t }
        );

        return newOperationCenter;
      }
    );
    const createdOperationCenters = await Promise.all(creationPromises);

    logger.info(
      { adminId: id_usuario, count: createdOperationCenters.length },
      `${createdOperationCenters.length} centro(s) de operación creado(s) exitosamente.`
    );

    return createdOperationCenters;
  });
};

/**
 * @async
 * @function updateOperationCenter
 * @description Actualiza los datos de un centro de operación existente.
 * @param {number} id - El ID del centro a actualizar.
 * @param {object} updateData - Los datos a modificar.
 * @returns {Promise<object>}
 * @throws {NotFoundError} Si el centro no se encuentra.
 * @throws {DuplicateError} Si se intenta cambiar a un código que ya está en uso.
 */
export const updateOperationCenter = async (id, updateData) => {
  const operationCenterDb = await operationCenterRepository.findById(id);
  if (!operationCenterDb) {
    throw new NotFoundError(
      `El centro de operacion con ID ${id} no fue encontrado`
    );
  }
  const updatedOperationCenter = await operationCenterRepository.update(
    id,
    updateData
  );
  return updatedOperationCenter;
};

/**
 * @async
 * @function stateOperationCenter
 * @description Cambia el estado (activo/inactivo) de un centro de operación.
 * @param {number} id - El ID del centro a modificar.
 * @param {object} updateData - Objeto con el nuevo estado (ej. { activo: false }).
 * @param {number} id_usuario - El ID del admin que realiza la acción.
 * @param {string} ip_usuario - La IP del admin.
 * @returns {Promise<object>}
 * @throws {NotFoundError} Si el centro no se encuentra.
 * @throws {AppError} Si se intenta aplicar un estado que el centro ya tiene.
 */
export const stateOperationCenter = async (
  id,
  updateData,
  id_usuario,
  ip_usuario
) => {
  return db.sequelize.transaction(async (t) => {
    const operationCenterDb = await operationCenterRepository.findById(id, {
      transaction: t,
    });

    if (updateData.activo !== undefined) {
      if (updateData.activo === operationCenterDb.activo) {
        const message = operationCenterDb.activo
          ? "El centro de operacion ya está activo."
          : "El centro de operacion ya está desactivo";
        throw new AlreadyDesactivated(message);
      }
    }

    const updatedOperationCenter = await operationCenterRepository.update(
      id,
      updateData,
      { transaction: t }
    );

    if (updateData.activo === false) {
      await logRepository.create({
        accion: "CERRAR_CENTRO_OPERACION",
        id_usuario: id_usuario,
        descripcion: `Se cerró el centro de operacion con codigo '${operationCenterDb.codigo}' (ID: ${id}).`,
        ip_usuario: ip_usuario,
      });

      return updatedOperationCenter;
    }

    await logRepository.create(
      {
        accion: "REABRIR_CENTRO_OPERACION",
        id_usuario: id_usuario,
        descripcion: `Se abrió el centro de operacion con codigo '${operationCenterDb.codigo}' (ID: ${id}).`,
        ip_usuario: ip_usuario,
      },
      { transaction: t }
    );

    logger.info(
      { adminId: id_usuario, targetCenterId: id, newState: updateData.activo },
      `Estado de centro de operación cambiado a '${updateData.activo}'.`
    );

    return updatedOperationCenter;
  });
};
