/**
 * @file peripheralService.js
 * @module Services
 * @description Capa de servicio que contiene toda la lógica de negocio para la gestión de periféricos (CRUD).
 * Este módulo actúa como intermediario entre los controladores y los repositorios, aplicando las reglas de negocio,
 * manejando la lógica de creación masiva, y registrando eventos de auditoría.
 * @requires ../models/index.js
 * @requires ../repositories/peripheralRepository.js
 * @requires ../repositories/logRepository.js
 * @requires ../repositories/decommissionRepository.js
 * @requires ../utils/customErrors.js
 * @requires ../config/logger.js
 */
import db from "../models/index.js";
import * as peripheralRepository from "../repositories/peripheralRepository.js";
import * as logRepository from "../repositories/logRepository.js";
import * as decomissionRepository from "../repositories/decommissionRepository.js";
import { AlreadyDesactivated, NotFoundError } from "../utils/customErrors.js";
import logger from "../config/logger.js";

/**
 * @async
 * @function fetchAllPeripherals
 * @description Obtiene una lista de todos los periféricos.
 * @returns {Promise<Array<object>>} Un array con los objetos de periférico.
 */
export const fetchAllPeripherals = async () => {
  const allPeripherals = await peripheralRepository.findAll();
  return allPeripherals;
};

/**
 * @async
 * @function getPeripheralById
 * @description Obtiene un periférico específico por su ID.
 * @param {number} id_periferico - El ID del periférico a buscar.
 * @returns {Promise<object>} El objeto del periférico encontrado.
 * @throws {NotFoundError} Si el periférico no se encuentra.
 */
export const getPeripheralById = async (id_periferico) => {
  const peripheral = await peripheralRepository.findById(id_periferico);
  if (!peripheral) {
    throw new NotFoundError(
      `Periferico con el ID ${id_periferico} no fue encontrado`
    );
  }
  return peripheral;
};

/**
 * @async
 * @function createPeripheral
 * @description Crea uno o más periféricos nuevos en una transacción, aplicando la lógica de rol.
 * @param {Array<object>} peripheralsData - Array de objetos con los datos de los periféricos a crear.
 * @param {object} user - El objeto del usuario autenticado que realiza la creación.
 * @param {string} ip_usuario - La dirección IP del usuario.
 * @returns {Promise<Array<object>>} Un array con los nuevos periféricos creados.
 */
export const createPeripheral = async (peripheralsData, ip_usuario, user) => {
  return db.sequelize.transaction(async (t) => {
    const creationPromises = peripheralsData.map(async (peripheralData) => {
      let peripheralForDb = {
        ...peripheralData,
        id_usuario_creador: user.id_usuario,
      };

      if (user.rol === "Encargado") {
        peripheralForDb.id_centro_operacion = user.id_centro_operacion;
      }

      const newPeripheral = await peripheralRepository.create(peripheralForDb, {
        transaction: t,
      });

      await logRepository.create(
        {
          accion: "CREAR_PERIFERICO",
          ip_usuario: ip_usuario,
          descripcion: `Se creó el periferico con serial '${newPeripheral.serial_periferico}' (ID: ${newPeripheral.id_periferico}).`,
          id_usuario: user.id_usuario,
        },
        { transaction: t }
      );

      return newPeripheral;
    });

    const createdPeripherals = await Promise.all(creationPromises);

    logger.info(
      { userId: user.id_usuario, count: createdPeripherals.length },
      "Periférico(s) creado(s) exitosamente."
    );

    return createdPeripherals;
  });
};

/**
 * @async
 * @function updatePeripheral
 * @description Actualiza los datos de un periférico existente.
 * @param {number} id_periferico - El ID del periférico a actualizar.
 * @param {object} updateData - Los datos a modificar.
 * @returns {Promise<object>} El objeto del periférico actualizado.
 * @throws {NotFoundError} Si el periférico no se encuentra.
 */
export const updatePeripheral = async (updateValidateData, id_periferico) => {
  const updatedPeripheral = await peripheralRepository.update(
    id_periferico,
    updateValidateData
  );
  return updatedPeripheral;
};

/**
 * @async
 * @function statePeripheral
 * @description Cambia el estado (activo/inactivo) de un periférico y crea los registros de auditoría correspondientes.
 * @param {number} id_periferico - El ID del periférico a modificar.
 * @param {object} updateData - El objeto con el nuevo estado (ej. { estado_periferico: false }).
 * @param {number} id_usuario - El ID del usuario que realiza la acción.
 * @param {string} ip_usuario - La IP del usuario.
 * @returns {Promise<object>} El objeto del periférico actualizado.
 * @throws {NotFoundError} Si el periférico no se encuentra.
 * @throws {AppError} Si se intenta aplicar un estado que el periférico ya tiene.
 */
export const statePeripheral = async (
  id_periferico,
  updateData,
  id_usuario,
  ip_usuario
) => {
  return db.sequelize.transaction(async (t) => {
    const peripheralDb = await peripheralRepository.findById(id_periferico, {
      transaction: t,
    });

    if (peripheralDb.estado_periferico !== undefined) {
      if (updateData.estado_periferico === peripheralDb.estado_periferico) {
        const message = peripheralDb.estado_periferico
          ? "El periferico ya se encuentra activo"
          : "El periferico ya está dado de baja";
        throw new AlreadyDesactivated(message);
      }
    }

    const updatedPeripheral = await peripheralRepository.update(
      id_periferico,
      { estado_periferico: updateData.estado_periferico },
      { transaction: t }
    );

    if (updateData.estado_periferico === false) {
      await decomissionRepository.create(
        {
          id_periferico: id_periferico,
          id_usuario: id_usuario,
        },
        { transaction: t }
      );

      await logRepository.create(
        {
          accion: "DAR_DE_BAJAR_PERIFERICO",
          id_usuario: id_usuario,
          descripcion: `Se dio de baja al periferico con serial '${peripheralDb.serial_periferico}' (ID: ${id_periferico}).`,
          ip_usuario: ip_usuario,
        },
        { transaction: t }
      );
      logger.info(
        { userId: id_usuario, peripheralId: id_periferico },
        "Periférico dado de baja exitosamente."
      );
    } else {
      await logRepository.create(
        {
          accion: "REACTIVAR_PERIFERICO",
          id_usuario: id_usuario,
          descripcion: `Se reactivó el periférico con serial '${peripheralDb.serial_periferico}' (ID: ${id_periferico}).`,
          ip_usuario: ip_usuario,
        },
        { transaction: t }
      );
      logger.info(
        { userId: id_usuario, peripheralId: id_periferico },
        "Periférico reactivado exitosamente."
      );
    }

    return updatedPeripheral;
  });
};
