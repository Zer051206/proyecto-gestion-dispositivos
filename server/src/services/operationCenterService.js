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

export const fetchOperationCenterById = async (id) => {
  const operationCenter = await operationCenterRepository.findById(id);
  if (!operationCenter) {
    throw new NotFoundError(
      `El centro de operacion con el ID ${id} no fue encontrado`
    );
  }
  return operationCenter;
};

export const createOperationCenter = async (
  operationCentersData,
  ip_usuario,
  id_usuario
) => {
  return db.sequelize.transaction(async (t) => {
    const creationPromises = operationCentersData.map(
      async (operationCenterData) => {
        const { codigo } = operationCenterData;

        const operationCenterDb = await operationCenterRepository.findByCode(
          codigo,
          { transaction: t }
        );

        if (operationCenterDb) {
          throw new AlreadyExistsError(
            "Ya existe un centro de operaciones con el mismo código"
          );
        }
        const opCenterData = {
          ...operationCenterData,
          id_admin_creador: id_usuario,
        };

        const newOperationCenter = await operationCenterRepository.create(
          opCenterData,
          { transaction: t }
        );

        await logRepository.create(
          {
            accion: "CREAR_CENTRO_OPERACION",
            ip_usuario: ip_usuario,
            descripcion: `Se creó el centro de operacion con codigo '${newOperationCenter.codigo}' (ID: ${newOperationCenter.id_centro_operacion}).`,
            id_usuario: id_usuario,
          },
          { transaction: t }
        );

        return newOperationCenter;
      }
    );
    const createdOperationCenters = await Promise.all(creationPromises);

    return createdOperationCenters;
  });
};

export const updateOperationCenter = async (id, updateData) => {
  const operationCenterDb = await operationCenterRepository.findById(id);
  if (!operationCenterDb) {
    throw new NotFoundError(
      `El centro de operacion con ID ${id} no fue encontrado`
    );
  }
  const updatedOperationCenter = await operationCenterRepository.update(
    id,
    updateData
  );
  return updatedOperationCenter;
};

export const stateOperationCenter = async (
  id,
  updateData,
  id_usuario,
  ip_usuario
) => {
  return db.sequelize.transaction(async (t) => {
    const operationCenterDb = await operationCenterRepository.findById(id, {
      transaction: t,
    });

    if (updateData.activo !== undefined) {
      if (updateData.activo === operationCenterDb.activo) {
        const message = operationCenterDb.activo
          ? "El centro de operacion ya está activo."
          : "El centro de operacion ya está desactivo";
        throw new AlreadyDesactivated(message);
      }
    }

    const updatedOperationCenter = await operationCenterRepository.update(
      id,
      { estado: updateData.activo },
      { transaction: t }
    );

    if (updateData.activo === false) {
      await logRepository.create({
        accion: "CERRAR_CENTRO_OPERACION",
        id_usuario: id_usuario,
        descripcion: `Se cerró el centro de operacion con codigo '${operationCenterDb.codigo}' (ID: ${id}).`,
        ip_usuario: ip_usuario,
      });

      return updatedOperationCenter;
    }

    await logRepository.create({
      accion: "REABRIR_CENTRO_OPERACION",
      id_usuario: id_usuario,
      descripcion: `Se abrió el centro de operacion con codigo '${operationCenterDb.codigo}' (ID: ${id}).`,
      ip_usuario: ip_usuario,
    });

    return updatedOperationCenter;
  });
};
