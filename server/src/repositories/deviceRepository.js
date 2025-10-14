// src/repositories/deviceRepository.js
import db from "../models/index.js";
const Device = db.Device;
const OperationCenter = db.OperationCenter;
const User = db.User;

/**
 * Busca todos los dispositivos.
 * @returns {Promise<Array<Device>>} Un array de dispositivos.
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
    ],
  });
};

/**
 * Busca un dispositivo por su ID.
 * @param {number} id - El ID del dispositivo.
 * @returns {Promise<Device|null>} El objeto del dispositivo o null si no se encuentra.
 */
export const findById = async (id) => {
  return Device.findByPk(id);
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

export const findByCenterId = async (id) => {
  return Device.findAll({
    where: { id_centro_operacion: id },
  });
};
