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
  const peripheral = await peripheralRepository.getById(id_periferico);
  if (!peripheral) {
    throw new NotFoundError(
      `Periferico con el ID ${id_periferico} no fue encontrado`
    );
  }
  return peripheral;
};

export const createPeripheral = async (
  createValidateData,
  ip_usuario,
  id_usuario
) => {
  return db.sequelize.transaction(async (t) => {
    const peripheralData = {
      ...createValidateData,
      id_usuario_creador: id_usuario,
    };
    const newPeripheral = await peripheralRepository.create(peripheralData, {
      transaction: t,
    });

    await logRepository.create(
      {
        accion: "CREAR_PERIFERICO",
        ip_usuario: ip_usuario,
        descripcion: `Se creó el equipo con serial '${newPeripheral.serial}' (ID: ${newPeripheral.id_periferico}).`,
        id_usuario: id_usuario,
      },
      { transaction: t }
    );

    return newPeripheral;
  });
};

export const updatePeripheral = async (updateValidateData, id) => {
  const updatedPeripheral = await peripheralRepository.update(
    updateValidateData,
    id
  );
  return updatedPeripheral;
};

export const decomissionPeripheral = async (
  id_periferico,
  id_usuario,
  ip_usuario
) => {
  return db.sequelize.transaction(async (t) => {
    const peripheralDb = await peripheralRepository.getById(id_periferico, {
      transaction: t,
    });

    if (peripheralDb.estado_periferico === false) {
      throw new AlreadyDesactivated(
        "El periferico ya se encuentra dado de baja"
      );
    }

    const updatedPeripheral = await peripheralRepository.update(
      id_periferico,
      { estado_periferico: false },
      { transaction: t }
    );

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
        descripcion: `Se dio de baja al equipo '${peripheralDb.serial}' (ID: ${id_periferico}).`,
        ip_usuario: ip_usuario,
      },
      { transaction: t }
    );

    return updatedPeripheral;
  });
};
