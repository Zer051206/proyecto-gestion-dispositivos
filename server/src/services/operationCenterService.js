import * as operationCenterRepository from "../repositories/operationCenterRepository.js";
import {
  NotFoundOperationCenterError,
  OperationCenterAlreadyExistsError,
} from "../utils/customErrors.js";

export const fetchAllOperationCenters = async () => {
  const allOperationCenters = await operationCenterRepository.findAll();
  return allOperationCenters;
};

export const getOperationCenterById = async (id) => {
  const operationCenter = await operationCenterRepository.findById(id);
  if (!operationCenter) {
    throw new NotFoundOperationCenterError();
  }
  return operationCenter;
};

export const createOperationCenter = async (createValidateData) => {
  const { codigo } = createValidateData;
  const operationCenterDb = await operationCenterRepository.findByCode(codigo);

  if (operationCenterDb) {
    throw new OperationCenterAlreadyExistsError();
  }

  const newOperationCenter = await operationCenterRepository.create(
    createValidateData
  );
  return newOperationCenter;
};

export const updateOperationCenter = async (updateValidateData, id) => {
  const updatedOperationCenter = await operationCenterRepository.update(
    updateValidateData,
    id
  );
  return updatedOperationCenter;
};
