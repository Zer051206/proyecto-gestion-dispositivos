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
  // <--- Nombre actualizado
  return Peripheral.findByPk(id);
};

/**
 * Crea un nuevo periférico.
 * @param {object} data - Los datos para el nuevo periférico.
 * @returns {Promise<Peripheral>} El objeto del periférico creado.
 */
export const create = async (data) => {
  return Peripheral.create(data);
};

/**
 * Actualiza un periférico existente.
 * @param {number} id - El ID del periférico a actualizar.
 * @param {object} data - Los nuevos datos para el periférico.
 * @returns {Promise<Peripheral|null>} El objeto del periférico actualizado o null.
 */
export const update = async (data, id) => {
  const [rowsAffected] = await Peripheral.update(data, {
    where: { id_periferico: id },
  });

  if (rowsAffected > 0) {
    return getById(id); // <--- Llamada interna actualizada
  }
  return null;
};

/**
 * Elimina un periférico.
 * @param {number} id - El ID del periférico a eliminar.
 * @returns {Promise<number>} El número de filas eliminadas.
 */
export const remove = async (id) => {
  return Peripheral.destroy({
    where: { id_periferico: id },
  });
};
