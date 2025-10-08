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
export const createDevice = async (
  createValidateData,
  id_usuario,
  ip_usuario
) => {
  return db.sequelize.transaction(async (t) => {
    const deviceData = {
      ...createValidateData,
      id_usuario_creador: id_usuario,
    };
    const newDevice = await deviceRepository.create(deviceData, {
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

    return {
      message: "Equipo registrado exitosamente",
      device: newDevice,
    };
  });
};

export const updateDevice = async (updateValidateData, id_equipo) => {
  const deviceExists = await deviceRepository.findById(id_equipo);
  if (!deviceExists) {
    throw new NotFoundError(`Equipo con ID ${id_equipo} no encontrado.`);
  }
  const updatedDevice = await deviceRepository.update(
    updateValidateData,
    id_equipo
  );
  return updatedDevice;
};

export const decomissionDevice = async (id_equipo, id_usuario, ip_usuario) => {
  return db.sequelize.transaction(async (t) => {
    const deviceDb = await deviceRepository.getById(id_equipo, {
      transaction: t,
    });

    if (deviceDb.estado_equipo === false) {
      throw new AlreadyDesactivated("El equipo ya se encuentra dado de baja");
    }

    const updatedDevice = await deviceRepository.update(
      id_equipo,
      { estado_equipo: false },
      {
        transaction: t,
      }
    );

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
        descripcion: `Se dio de baja al equipo '${deviceDb.serial}' (ID: ${id_equipo}).`,
        ip_usuario: ip_usuario,
      },
      { transaction: t }
    );

    return {
      message: "Equipo dado de baja exitosamente",
      device: updatedDevice,
    };
  });
};
