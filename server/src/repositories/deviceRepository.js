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
export const findById = async (id_equipo) => {
  return Device.findByPk(id_equipo);
};

/**
 * Crea un nuevo dispositivo.
 * @param {object} data - Los datos para el nuevo dispositivo.
 * @returns {Promise<Device>} El objeto del dispositivo creado.
 */
export const create = async (data, options = {}) => {
  return Device.create(data, options);
};

/**
 * Actualiza un dispositivo existente.
 * @param {number} id - El ID del dispositivo a actualizar.
 * @param {object} data - Los nuevos datos para el dispositivo.
 * @returns {Promise<Device|null>} El objeto del dispositivo actualizado o null.
 */
export const update = async (data, id_equipo, options = {}) => {
  const [rowsAffected] = await Device.update(data, {
    where: { id_equipo: id_equipo },
    ...options,
  });

  if (rowsAffected > 0) {
    return findById(id_equipo);
  }
  return null;
};
