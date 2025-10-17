/**
 * @file operationCenterRepository.js
 * @module Repositories
 * @description Capa de acceso a datos para la entidad 'OperationCenter' (Centro de Operación).
 * Este módulo encapsula todas las consultas a la base de datos relacionadas con los centros de operación,
 * utilizando Sequelize para interactuar con la tabla 'centros_operacion'.
 * @requires ../models/index.js
 */
import db from "../models/index.js";
const OperationCenter = db.OperationCenter;
const User = db.User;
const City = db.City;

/**
 * @async
 * @function findAll
 * @description Busca y devuelve todos los centros de operación con sus relaciones principales (Usuario creador y Ciudad).
 * @returns {Promise<Array<OperationCenter>>} Un array de todos los objetos de centro de operación con sus datos asociados.
 */
export const findAll = async () => {
  return OperationCenter.findAll({
    include: [
      {
        model: User,
        as: "AdminCreador",
        attributes: ["id_usuario", "nombre", "apellido"],
      },
      { model: City, attributes: ["id_ciudad", "nombre_ciudad"] },
    ],
  });
};

/**
 * @async
 * @function findById
 * @description Busca un centro de operación específico por su clave primaria (ID) con sus relaciones.
 * @param {number} id - El ID del centro de operación a buscar.
 * @returns {Promise<OperationCenter|null>} El objeto del centro de operación si se encuentra, o null si no.
 */
export const findById = async (id) => {
  return OperationCenter.findByPk(id, {
    include: [
      {
        model: User,
        as: "AdminCreador",
        attributes: ["id_usuario", "nombre", "apellido"],
      },
      { model: City, attributes: ["id_ciudad", "nombre_ciudad"] },
    ],
  });
};

/**
 * @async
 * @function findByCode
 * @description Busca un centro de operación por su código único.
 * @param {string} codigo - El código del centro de operación a buscar.
 * @returns {Promise<OperationCenter|null>} El objeto del centro de operación si se encuentra, o null.
 */
export const findByCode = async (codigo) => {
  return OperationCenter.findOne({ where: { codigo: codigo } });
};

/**
 * @async
 * @function create
 * @description Crea un nuevo registro de centro de operación en la base de datos.
 * @param {object} data - Los datos del centro de operación a crear.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. para transacciones).
 * @returns {Promise<OperationCenter>} El objeto del centro de operación recién creado.
 */
export const create = async (data, options = {}) => {
  return OperationCenter.create(data, options);
};

/**
 * @async
 * @function update
 * @description Actualiza los datos de un centro de operación existente por su ID.
 * @param {number} id - El ID del centro de operación a actualizar.
 * @param {object} data - Un objeto con los campos y nuevos valores a actualizar.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. para transacciones).
 * @returns {Promise<OperationCenter|null>} El objeto del centro de operación actualizado si la operación fue exitosa, o null.
 */
export const update = async (id, data, options = {}) => {
  const [rowsAffected] = await OperationCenter.update(data, {
    where: { id_centro_operacion: id },
    ...options,
  });

  if (rowsAffected > 0) {
    return findById(id);
  }
  return null;
};
