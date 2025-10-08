import db from "../models/index.js";
import * as operationCenterRepository from "../repositories/operationCenterRepository.js";
import * as logRepository from "../repositories/logRepository.js";
import {
  AlreadyDesactivated,
  AlreadyExistsError,
  NotFoundError,
} from "../utils/customErrors.js";

export const fetchAllOperationCenters = async () => {
  const allOperationCenters = await operationCenterRepository.findAll();
  return allOperationCenters;
};

export const fetchOperationCenterById = async (id_centro_operacion) => {
  const operationCenter = await operationCenterRepository.findById(
    id_centro_operacion
  );
  if (!operationCenter) {
    throw new NotFoundError(
      `El centro de operacion con el ID ${id_centro_operacion} no fue encontrado`
    );
  }
  return operationCenter;
};

export const createOperationCenter = async (
  createValidateData,
  ip_usuario,
  id_usuario
) => {
  return db.sequelize.transaction(async (t) => {
    const { codigo } = createValidateData;
    const operationCenterDb = await operationCenterRepository.findByCode(
      codigo,
      { transaction: t }
    );

    if (operationCenterDb) {
      throw new AlreadyExistsError(
        "Ya existe un centro de operaciones con el mismo código"
      );
    }

    const operationCenterData = {
      ...createValidateData,
      id_usuario: id_usuario,
    };

    const newOperationCenter = await operationCenterRepository.create(
      operationCenterData,
      { transaction: t }
    );

    await logRepository.create(
      {
        accion: "CREAR_CENTRO_OPERACION",
        ip_usuario: ip_usuario,
        descripcion: `Se creó el equipo con serial '${newOperationCenter.serial}' (ID: ${newOperationCenter.id_centro_operacion}).`,
        id_usuario: id_usuario,
      },
      { transaction: t }
    );

    return {
      message: "Centro de operación registrado exitosamente.",
      operationCenter: {
        id: newOperationCenter.id_centro_operacion,
      },
    };
  });
};

export const updateOperationCenter = async (updateValidateData, id) => {
  const updatedOperationCenter = await operationCenterRepository.update(
    updateValidateData,
    id
  );
  return updatedOperationCenter;
};

export const closeOperationCenter = async (
  id_centro_operacion,
  id_usuario,
  ip_usuario
) => {
  return db.sequelize.transaction(async (t) => {
    const operationCenterDb = await operationCenterRepository.findById(
      id_centro_operacion,
      { transaction: t }
    );

    if (operationCenterDb.estado === false) {
      throw new AlreadyDesactivated(
        "El centro de operaciones ya se encuentra desactivado."
      );
    }

    const closedOperationCenter = await operationCenterRepository.update(
      id_centro_operacion,
      { estado: false },
      { transaction: t }
    );

    await logRepository.create({
      accion: "CERRAR_CENTRO_OPERACION",
      id_usuaio: id_usuario,
      descripcion: `Se dio de baja al equipo '${operationCenterDb.serial}' (ID: ${id_centro_operacion}).`,
      ip_usuario: ip_usuario,
    });

    return closedOperationCenter;
  });
};
