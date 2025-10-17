/**
 * @file deviceRepository.js
 * @module Repositories
 * @description Capa de acceso a datos para la entidad 'Device' (Equipo).
 * Este módulo encapsula todas las consultas a la base de datos relacionadas con los equipos,
 * utilizando Sequelize para interactuar con la tabla 'equipos'.
 * @requires ../models/index.js
 */
import db from "../models/index.js";
const Device = db.Device;
const OperationCenter = db.OperationCenter;
const User = db.User;
const CenterCost = db.CenterCost;

/**
 * @async
 * @function findAll
 * @description Busca y devuelve todos los equipos con sus relaciones principales.
 * @returns {Promise<Array<Device>>} Un array de todos los objetos de equipo con sus datos asociados.
 */
export const findAll = async () => {
  return Device.findAll({
    include: [
      { model: OperationCenter, attributes: ["codigo", "direccion"] },
      {
        model: User,
        as: "Creador",
        attributes: ["nombre", "apellido"],
      },
      { model: CenterCost, attibutes: ["codigo_centro_costo", "centro_costo"] },
    ],
  });
};

/**
 * @async
 * @function findById
 * @description Busca un equipo específico por su clave primaria (ID) con sus relaciones.
 * @param {number} id - El ID del equipo a buscar.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. transacciones).
 * @returns {Promise<Device|null>} El objeto del equipo si se encuentra, o null si no.
 */
export const findById = async (id) => {
  return Device.findByPk(id);
};

/**
 * @async
 * @function create
 * @description Crea un nuevo registro de equipo en la base de datos.
 * @param {object} data - Los datos del equipo a crear.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. transacciones).
 * @returns {Promise<Device>} El objeto del equipo recién creado.
 */
export const create = async (data, options = {}) => {
  return Device.create(data, options);
};

/**
 * @async
 * @function update
 * @description Actualiza los datos de un equipo existente por su ID.
 * @param {number} id - El ID del equipo a actualizar.
 * @param {object} data - Un objeto con los campos y nuevos valores a actualizar.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. transacciones).
 * @returns {Promise<Device|null>} El objeto del equipo actualizado si la operación fue exitosa, o null.
 */
export const update = async (id, data, options = {}) => {
  const [rowsAffected] = await Device.update(data, {
    where: { id_equipo: id },
    ...options,
  });

  if (rowsAffected > 0) {
    return findById(id);
  }
  return null;
};

/**
 * @async
 * @function findByCenterId
 * @description Busca y devuelve todos los equipos asociados a un centro de operación específico.
 * @param {number} id_centro_operacion - El ID del centro de operación.
 * @returns {Promise<Array<Device>>} Un array de los equipos encontrados para ese centro.
 */
export const findByCenterId = async (id) => {
  return Device.findAll({
    where: { id_centro_operacion: id },
    include: [
      { model: OperationCenter, attributes: ["codigo", "direccion"] },
      {
        model: User,
        as: "Creador",
        attributes: ["nombre", "apellido", "rol"],
      },
    ],
  });
};
