import db from "../models/index.js";

const Device = db.Device;

export const findBySerial = async (serial) => {
  return Device.findOne({
    where: { serial: serial },
  });
};

export const createDevice = async (deviceData, options = {}) => {
  return Device.create(deviceData, options);
};

/**
 * @async
 * @function updateDevice
 * @description Actualiza los datos de un dispositivo por su ID.
 * @param {number} id_dispositivo - ID del dispositivo a actualizar.
 * @param {object} deviceData - Objeto con los campos a actualizar (usando updateDeviceSchema.partial()).
 * @param {object} [options={}] - Opciones de Sequelize (para la transacción).
 * @returns {Promise<Array<number>>} Array con el número de filas afectadas (ej: [1]).
 */
export const updateDevice = async (
  id_dispositivo,
  deviceData,
  options = {}
) => {
  // deviceData es el objeto dinámico con solo los campos a cambiar.
  return Device.update(
    deviceData, // Los valores SET
    {
      where: { id_dispositivo: id_dispositivo },
      ...options, // Pasa la transacción si existe
    }
  );
};
