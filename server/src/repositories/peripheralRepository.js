// src/repositories/peripheralRepository.js
import db from "../models/index.js";
const Peripheral = db.Peripheral;
const PeripheralType = db.PeripheralType;

/**
 * Busca todos los periféricos.
 * @returns {Promise<Array<Peripheral>>} Un array de periféricos.
 */
export const findAll = async () => {
  return Peripheral.findAll({
    include: [{ model: PeripheralType, attributes: ["tipo_periferico"] }],
  });
};

/**
 * Busca un periférico por su ID.
 * @param {number} id - El ID del periférico.
 * @returns {Promise<Peripheral|null>} El objeto del periférico o null si no se encuentra.
 */
export const getById = async (id) => {
  return Peripheral.findByPk(id);
};

/**
 * Crea un nuevo periférico.
 * @param {object} data - Los datos para el nuevo periférico.
 * @returns {Promise<Peripheral>} El objeto del periférico creado.
 */
export const create = async (data, options = {}) => {
  return Peripheral.create(data, options);
};

/**
 * Actualiza un periférico existente.
 * @param {number} id - El ID del periférico a actualizar.
 * @param {object} data - Los nuevos datos para el periférico.
 * @returns {Promise<Peripheral|null>} El objeto del periférico actualizado o null.
 */
export const update = async (data, id, options = {}) => {
  const [rowsAffected] = await Peripheral.update(data, {
    where: { id_periferico: id },
    ...options,
  });

  if (rowsAffected > 0) {
    return getById(id); // <--- Llamada interna actualizada
  }
  return null;
};

export const findByCenterId = async (id_centro_operacion) => {
  return Peripheral.findAll({
    where: { id_centro_operacion: id_centro_operacion },
  });
};
