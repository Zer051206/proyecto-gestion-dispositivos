import db from "../models/index.js";
import * as peripheralRepository from "../repositories/peripheralRepository.js";
import * as logRepository from "../repositories/logRepository.js";
import * as decomissionRepository from "../repositories/decommissionRepository.js";
import { AlreadyDesactivated, NotFoundError } from "../utils/customErrors.js";

export const fetchAllPeripherals = async () => {
  const allPeripherals = await peripheralRepository.findAll();
  return allPeripherals;
};

export const getPeripheralById = async (id_periferico) => {
  const peripheral = await peripheralRepository.findById(id_periferico);
  if (!peripheral) {
    throw new NotFoundError(
      `Periferico con el ID ${id_periferico} no fue encontrado`
    );
  }
  return peripheral;
};

export const createPeripheral = async (
  peripheralsData,
  ip_usuario,
  id_usuario
) => {
  return db.sequelize.transaction(async (t) => {
    const creationPromises = peripheralsData.map(async (peripheralData) => {
      const peripheralForDb = {
        ...peripheralData,
        id_usuario_creador: id_usuario,
      };

      const newPeripheral = await peripheralRepository.create(peripheralForDb, {
        transaction: t,
      });

      await logRepository.create(
        {
          accion: "CREAR_PERIFERICO",
          ip_usuario: ip_usuario,
          descripcion: `Se creó el periferico con serial '${newPeripheral.serial_periferico}' (ID: ${newPeripheral.id_periferico}).`,
          id_usuario: id_usuario,
        },
        { transaction: t }
      );

      return newPeripheral;
    });

    const createdPeripherals = Promise.all(creationPromises);

    return createdPeripherals;
  });
};

export const updatePeripheral = async (updateValidateData, id_periferico) => {
  const updatedPeripheral = await peripheralRepository.update(
    id_periferico,
    updateValidateData
  );
  return updatedPeripheral;
};

export const statePeripheral = async (
  id_periferico,
  updateData,
  id_usuario,
  ip_usuario
) => {
  return db.sequelize.transaction(async (t) => {
    const peripheralDb = await peripheralRepository.findById(id_periferico, {
      transaction: t,
    });

    if (peripheralDb.estado_periferico !== undefined) {
      if (updateData.estado_periferico === peripheralDb.estado_periferico) {
        const message = peripheralDb.estado_periferico
          ? "El periferico ya se encuentra activo"
          : "El periferico ya está dado de baja";
        throw new AlreadyDesactivated(message);
      }
    }

    const updatedPeripheral = await peripheralRepository.update(
      id_periferico,
      { estado_periferico: updateData.estado_periferico },
      { transaction: t }
    );

    if (updateData.estado_periferico === false) {
      await decomissionRepository.create(
        {
          id_periferico: id_periferico,
          id_usuario: id_usuario,
        },
        { transaction: t }
      );

      await logRepository.create(
        {
          accion: "DAR_DE_BAJAR_PERIFERICO",
          id_usuario: id_usuario,
          descripcion: `Se dio de baja al periferico con serial '${peripheralDb.serial_periferico}' (ID: ${id_periferico}).`,
          ip_usuario: ip_usuario,
        },
        { transaction: t }
      );
      return updatedPeripheral;
    }

    await logRepository.create(
      {
        accion: "REACTIVAR_PERIFERICO",
        id_usuario: id_usuario,
        descripcion: `Se reactivo el periferico con serial '${peripheralDb.serial_periferico}' (ID: ${id_periferico}).`,
        ip_usuario: ip_usuario,
      },
      { transaction: t }
    );

    return updatedPeripheral;
  });
};
