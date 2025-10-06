// src/repositories/operationCenterRepository.js
import db from "../models/index.js";
const OperationCenter = db.OperationCenter;
const User = db.User;
const City = db.City;

/**
 * Busca todos los centros de operación.
 * @returns {Promise<Array<OperationCenter>>} Un array de centros de operación.
 */
export const findAll = async () => {
  return OperationCenter.findAll({
    include: [
      { model: User, attributes: ["id_usuario", "nombre", "apellido"] },
      { model: City, attributes: ["id_ciudad", "nombre_ciudad"] },
    ],
  });
};

/**
 * Busca un centro de operación por su ID.
 * @param {number} id - El ID del centro de operación.
 * @returns {Promise<OperationCenter|null>} El objeto del centro de operación o null si no se encuentra.
 */
export const getById = async (id) => {
  // <--- Nombre actualizado
  return OperationCenter.findByPk(id, {
    include: [
      { model: User, attributes: ["id_usuario", "nombre", "apellido"] },
      { model: City, attributes: ["id_ciudad", "nombre_ciudad"] },
    ],
  });
};

/**
 * Busca un centro de operación por su código único.
 * @param {number} codigo - El código del centro de operación.
 * @returns {Promise<OperationCenter|null>} El objeto del centro de operación o null.
 */
export const getByCode = async (codigo) => {
  // <--- Nombre actualizado
  return OperationCenter.findOne({ where: { codigo } });
};

/**
 * Crea un nuevo centro de operación.
 * @param {object} data - Los datos para el nuevo centro de operación.
 * @returns {Promise<OperationCenter>} El objeto del centro de operación creado.
 */
export const create = async (data) => {
  return OperationCenter.create(data);
};

/**
 * Actualiza un centro de operación existente.
 * @param {number} id - El ID del centro de operación a actualizar.
 * @param {object} data - Los nuevos datos para el centro de operación.
 * @returns {Promise<OperationCenter|null>} El objeto del centro de operación actualizado o null.
 */
export const update = async (data, id) => {
  const [rowsAffected] = await OperationCenter.update(data, {
    where: { id_centro_operacion: id },
  });

  if (rowsAffected > 0) {
    return getById(id); // <--- Llamada interna actualizada
  }
  return null;
};

/**
 * Elimina un centro de operación.
 * @param {number} id - El ID del centro de operación a eliminar.
 * @returns {Promise<number>} El número de filas eliminadas.
 */
export const remove = async (id) => {
  return OperationCenter.destroy({
    where: { id_centro_operacion: id },
  });
};
