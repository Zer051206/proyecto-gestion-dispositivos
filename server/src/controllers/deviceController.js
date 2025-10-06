import {
  updateDeviceSchema,
  createDeviceSchema,
} from "../schemas/deviceSchema.js";
import * as deviceService from "../services/deviceService.js";

export const getAllDevices = async (req, res, next) => {
  try {
    const allDevices = await deviceService.fetchAllDevices();
    return res.status(200).json(allDevices);
  } catch (error) {
    next(error);
  }
};

export const getDeviceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const device = await deviceService.getDeviceById(id);
    return res.status(200).json(device);
  } catch (error) {
    next(error);
  }
};

export const createDevice = async (req, res, next) => {
  try {
    const createValidateData = createDeviceSchema.parse(req.body);
    const newDevice = await deviceService.createDevice(createValidateData);
    return res.status(201).json(newDevice);
  } catch (error) {
    next(error);
  }
};

export const updateDevice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateValidateData = updateDeviceSchema.parse(req.body);
    const updatedDevice = await deviceService.updateDevice(
      updateValidateData,
      id
    );
    return res.status(200).json(updatedDevice);
  } catch (error) {
    next(error);
  }
};
