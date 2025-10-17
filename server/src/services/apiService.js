/**
 * @file apiService.js
 * @module Services
 * @description Capa de servicio que centraliza la lógica de negocio para obtener colecciones de datos.
 * Este servicio actúa como un orquestador que llama a los repositorios correspondientes,
 * aplica la lógica de autorización basada en roles y formatea los datos para los controladores.
 * @requires ../repositories/*.js
 * @requires ../config/logger.js
 */
import * as deviceRepository from "../repositories/deviceRepository.js";
import * as peripheralRepository from "../repositories/peripheralRepository.js";
import * as operationCenterRepository from "../repositories/operationCenterRepository.js";
import * as userRepository from "../repositories/userRepository.js";
import * as logRepository from "../repositories/logRepository.js";
import * as decomissionRepository from "../repositories/decommissionRepository.js";
import * as centerCostRepository from "../repositories/centerCostRepository.js";

/**
 * @async
 * @function getAssets
 * @description Obtiene una lista de activos (equipos y periféricos), filtrada según el rol del usuario.
 * @param {object} user - El objeto del usuario autenticado (de req.user).
 * @returns {Promise<Array<object>>} Una lista combinada y tipada de activos.
 */
export const getAssets = async (user) => {
  if (user.rol === "Admin") {
    const devices = await deviceRepository.findAll();
    const peripherals = await peripheralRepository.findAll();
    const typedDevices = devices.map((d) => ({
      ...d.dataValues,
      type: "device",
    }));
    const typedPeripherals = peripherals.map((p) => ({
      ...p.dataValues,
      type: "peripheral",
    }));
    return [...typedDevices, ...typedPeripherals];
  } else if (user.rol === "Encargado") {
    const id_centro_operacion = user.id_centro_operacion;
    if (!id_centro_operacion) {
      return [];
    }
    const devices = await deviceRepository.findByCenterId(id_centro_operacion);
    const peripherals = await peripheralRepository.findByCenterId(
      id_centro_operacion
    );
    const typedDevices = devices.map((d) => ({
      ...d.dataValues,
      type: "device",
    }));
    const typedPeripherals = peripherals.map((p) => ({
      ...p.dataValues,
      type: "peripheral",
    }));
    return [...typedDevices, ...typedPeripherals];
  }
  return [];
};

/**
 * @async
 * @function getOperationCenters
 * @description Obtiene una lista de centros de operación, filtrada por rol.
 * @param {object} user - El objeto del usuario autenticado.
 * @returns {Promise<Array<object>>} Un array de centros de operación.
 */
export const getOperationCenters = async (user) => {
  if (user.rol === "Admin") {
    const operationCenters = await operationCenterRepository.findAll();
    if (!operationCenters) {
      return [];
    }
    return operationCenters;
  } else if (user.rol === "Encargado") {
    const operationCenters = await operationCenterRepository.findById(
      user.id_centro_operacion
    );
    if (!operationCenters) {
      return [];
    }
    return operationCenters;
  }
  return [];
};

/**
 * @async
 * @function getUsers
 * @description Obtiene una lista de todos los usuarios.
 * @returns {Promise<Array<object>>}
 */
export const getUsers = async () => {
  const users = await userRepository.findAll();
  if (!users) {
    return [];
  }
  return users;
};

/**
 * @async
 * @function getLogs
 * @description Obtiene los registros de log, filtrados por rol.
 * @param {object} user - El objeto del usuario autenticado.
 * @returns {Promise<Array<object>>}
 */
export const getLogs = async (user) => {
  if (user.rol === "Admin") {
    const logs = await logRepository.findAll();
    if (!logs) {
      return [];
    }
    return logs;
  } else if (user.rol === "Encargado") {
    const logs = await logRepository.findAllById(user.id_usuario);
    if (!logs) {
      return [];
    }
    return logs;
  }
  return [];
};

/**
 * @async
 * @function getDecomissions
 * @description Obtiene los registros de bajas, filtrados por rol.
 * @param {object} user - El objeto del usuario autenticado.
 * @returns {Promise<Array<object>>}
 */
export const getDecomissions = async (user) => {
  if (user.rol === "Admin") {
    const decomissions = await decomissionRepository.findAll();
    if (!decomissions) {
      return [];
    }
    return decomissions;
  } else if (user.rol === "Encargado") {
    const decomissions = await decomissionRepository.findAllByCenterId(
      user.id_centro_operacion
    );
    if (!decomissions) {
      return [];
    }
    return decomissions;
  }
  return [];
};

/**
 * @async
 * @function getCenterCostByCenterOperation
 * @description Obtiene los centros de costo de un centro de operación específico.
 * @param {number} id_centro_operacion - El ID del centro de operación.
 * @returns {Promise<Array<object>>}
 */
export const getCenterCostByCenterOperation = async (id_centro_operacion) => {
  const centerCost = await centerCostRepository.findAllByCenterOperation(
    id_centro_operacion
  );
  if (!centerCost) {
    return [];
  }
  return centerCost;
};
