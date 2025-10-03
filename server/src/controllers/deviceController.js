import { updateDeviceSchema } from "../schemas/deviceSchema.js";
import * as deviceService from "../services/deviceService.js";

export const getDeviceHistorial = async (req, res, next) => {
  try {
    const deviceHistorial = await deviceService.fetchDeviceHistorial();
    return res.status(200).json(deviceHistorial);
  } catch (error) {
    next(error);
  }
};

export const updateDevice = async (req, res, next) => {
  try {
    const updateValidateData = updateDeviceSchema.parse(req.body);
    const updatedDevice = await deviceService.updateDevice(updateValidateData);
    return res.status(200).json(updatedDevice);
  } catch (error) {
    next(error);
  }
};
