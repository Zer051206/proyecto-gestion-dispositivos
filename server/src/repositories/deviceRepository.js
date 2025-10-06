// src/repositories/deviceRepository.js
import db from "../models/index.js";
const Device = db.Device;

/**
 * Busca todos los dispositivos.
 * @returns {Promise<Array<Device>>} Un array de dispositivos.
 */
export const findAll = async () => {
  return Device.findAll();
};

/**
 * Busca un dispositivo por su ID.
 * @param {number} id - El ID del dispositivo.
 * @returns {Promise<Device|null>} El objeto del dispositivo o null si no se encuentra.
 */
export const getById = async (id) => {
  // <--- Nombre actualizado
  return Device.findByPk(id);
};

/**
 * Crea un nuevo dispositivo.
 * @param {object} data - Los datos para el nuevo dispositivo.
 * @returns {Promise<Device>} El objeto del dispositivo creado.
 */
export const create = async (data) => {
  return Device.create(data);
};

/**
 * Actualiza un dispositivo existente.
 * @param {number} id - El ID del dispositivo a actualizar.
 * @param {object} data - Los nuevos datos para el dispositivo.
 * @returns {Promise<Device|null>} El objeto del dispositivo actualizado o null.
 */
export const update = async (data, id) => {
  const [rowsAffected] = await Device.update(data, {
    where: { id_equipo: id },
  });

  if (rowsAffected > 0) {
    return getById(id); // <--- Llamada interna actualizada
  }
  return null;
};

/**
 * Elimina un dispositivo.
 * @param {number} id - El ID del dispositivo a eliminar.
 * @returns {Promise<number>} El número de filas eliminadas.
 */
export const remove = async (id) => {
  return Device.destroy({
    where: { id_equipo: id },
  });
};
