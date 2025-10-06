import * as deviceRepository from "../repositories/deviceRepository.js";
import { NotFoundDeviceError } from "../utils/customErrors.js";

export const fetchAllDevices = async () => {
  const allDevices = await deviceRepository.findAll();
  return allDevices;
};

export const getDeviceById = async (id) => {
  const device = await deviceRepository.getById(id);
  if (!device) {
    throw new NotFoundDeviceError();
  }
  return device;
};

export const createDevice = async (createValidateData) => {
  const newDevice = await deviceRepository.create(createValidateData);
  return newDevice;
};

export const updateDevice = async (updateValidateData, id) => {
  const updatedDevice = await deviceRepository.update(updateValidateData, id);
  return updatedDevice;
};
