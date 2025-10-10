import db from "../models/index.js";
const Log = db.Log;

export const findAll = async (options = {}) => {
  return Log.findAll(options);
};

export const findAllById = async (id_usuario) => {
  return Log.findAll({
    where: { id_usuario: id_usuario },
  });
};

/**
 * Crea un nuevo registro de log.
 * @param {object} logData - Los datos del log (accion, descripcion, etc.).
 * @param {object} options - Opciones de Sequelize (ej. para transacciones).
 * @returns {Promise<Log>} El objeto del log creado.
 */
export const create = async (logData, options = {}) => {
  return Log.create(logData, options);
};
