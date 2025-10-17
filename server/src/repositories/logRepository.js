/**
 * @file logRepository.js
 * @module Repositories
 * @description Capa de acceso a datos para la entidad 'Log'.
 * Este módulo encapsula todas las consultas a la base de datos relacionadas con los registros de auditoría (logs),
 * utilizando Sequelize para interactuar con la tabla 'logs'.
 * @requires ../models/index.js
 */
import db from "../models/index.js";
const Log = db.Log;
const User = db.User;

/**
 * @async
 * @function findAll
 * @description Busca y devuelve todos los registros de log con el usuario asociado a cada uno.
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. para transacciones).
 * @returns {Promise<Array<Log>>} Un array de todos los objetos de log con sus datos de usuario asociados.
 */
export const findAll = async (options = {}) => {
  return Log.findAll({
    include: { model: User, attributes: ["nombre", "apellido", "rol"] },
    ...options,
  });
};

/**
 * @async
 * @function findAllById
 * @description Busca y devuelve todos los registros de log realizados por un usuario específico.
 * @param {number} id_usuario - El ID del usuario por el cual filtrar los registros.
 * @returns {Promise<Array<Log>>} Un array de los registros de log encontrados para ese usuario.
 */
export const findAllById = async (id) => {
  return Log.findAll({
    where: { id_usuario: id },
    include: [{ model: User, attributes: ["nombre", "apellido", "rol"] }],
  });
};

/**
 * @async
 * @function create
 * @description Crea un nuevo registro de log en la base de datos.
 * @param {object} logData - Los datos del log (accion, descripcion, id_usuario, etc.).
 * @param {object} [options={}] - Opciones adicionales de Sequelize (ej. para transacciones).
 * @returns {Promise<Log>} El objeto del log recién creado.
 */
export const create = async (logData, options = {}) => {
  return Log.create(logData, options);
};
