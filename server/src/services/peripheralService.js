import * as peripheralRepository from "../repositories/peripheralRepository.js";
import { NotFoundPeripheralError } from "../utils/customErrors.js";

export const fetchAllPeripherals = async () => {
  const allPeripherals = await peripheralRepository.findAll();
  return allPeripherals;
};

export const getPeripheralById = async (id) => {
  const peripheral = await peripheralRepository.getById(id);
  if (!peripheral) {
    throw new NotFoundPeripheralError();
  }
  return peripheral;
};

export const createPeripheral = async (createValidateData) => {
  const newPeripheral = await peripheralRepository.create(createValidateData);
  return newPeripheral;
};

export const updatePeripheral = async (updateValidateData, id) => {
  const updatedPeripheral = await peripheralRepository.update(
    updateValidateData,
    id
  );
  return updatedPeripheral;
};
