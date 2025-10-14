import db from "../models/index.js";
import * as deviceRepository from "../repositories/deviceRepository.js";
import * as logRepository from "../repositories/logRepository.js";
import * as decomissionRepository from "../repositories/decommissionRepository.js";
import { AlreadyDesactivated, NotFoundError } from "../utils/customErrors.js";

export const fetchAllDevices = async () => {
  const allDevices = await deviceRepository.findAll();
  return allDevices;
};

export const getDeviceById = async (id) => {
  const device = await deviceRepository.findById(id);
  if (!device) throw new NotFoundError(`Equipo con ID ${id} no encontrado.`);
  return device;
};
export const createDevice = async (devicesData, id_usuario, ip_usuario) => {
  return db.sequelize.transaction(async (t) => {
    const creationPromises = devicesData.map(async (deviceData) => {
      const deviceForDb = { ...deviceData, id_usuario_creador: id_usuario };

      const newDevice = await deviceRepository.create(deviceForDb, {
        transaction: t,
      });

      await logRepository.create(
        {
          accion: "CREAR_EQUIPO",
          id_usuario: id_usuario,
          descripcion: `Se creó el equipo con serial '${newDevice.serial}' (ID: ${newDevice.id_equipo}).`,
          ip_usuario: ip_usuario,
        },
        { transaction: t }
      );

      return newDevice;
    });

    const createdDevices = await Promise.all(creationPromises);

    return createdDevices;
  });
};

export const updateDevice = async (updateValidateData, id_equipo) => {
  const deviceExists = await deviceRepository.findById(id_equipo);
  if (!deviceExists) {
    throw new NotFoundError(`Equipo con ID ${id_equipo} no encontrado.`);
  }
  const updatedDevice = await deviceRepository.update(
    id_equipo,
    updateValidateData
  );
  return updatedDevice;
};

export const stateDevice = async (
  id_equipo,
  updateData,
  id_usuario,
  ip_usuario
) => {
  return db.sequelize.transaction(async (t) => {
    const deviceDb = await deviceRepository.findById(id_equipo, {
      transaction: t,
    });

    if (updateData !== undefined) {
      if (updateData.estado_equipo === deviceDb.estado_equipo) {
        const message = deviceDb.estado_equipo
          ? "El equipo ya se encuentra activo"
          : "El equipo ya está dado de baja";
        throw new AlreadyDesactivated(message);
      }
    }

    const updatedDevice = await deviceRepository.update(
      id_equipo,
      { estado_equipo: updateData.estado_equipo },
      {
        transaction: t,
      }
    );

    if (updateData.estado_equipo === false) {
      await decomissionRepository.create(
        {
          id_equipo: id_equipo,
          id_usuario: id_usuario,
        },
        { transaction: t }
      );

      await logRepository.create(
        {
          accion: "DAR_DE_BAJA_EQUIPO",
          id_usuario: id_usuario,
          descripcion: `Se dio de baja al equipo con serial '${deviceDb.serial}' (ID: ${id_equipo}).`,
          ip_usuario: ip_usuario,
        },
        { transaction: t }
      );

      return {
        message: "Equipo dado de baja exitosamente",
        device: updatedDevice,
      };
    }

    await logRepository.create(
      {
        accion: "REACTIVAR_EQUIPO",
        id_usuario: id_usuario,
        descripcion: `Se reactivo el equipo con serial '${deviceDb.serial}' (ID: ${id_equipo}).`,
        ip_usuario: ip_usuario,
      },
      { transaction: t }
    );

    return updatedDevice;
  });
};
