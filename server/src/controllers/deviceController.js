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
    const ip_usuario = req.ip;
    const user = req.user;
    const createValidateData = createDeviceSchema.parse(req.body);
    const newDevices = await deviceService.createDevice(
      createValidateData,
      user,
      ip_usuario
    );
    return res.status(201).json({
      message: "Equipo registrado exitosamente.",
      success: true,
      devices: newDevices,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDevice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateValidateData = updateDeviceSchema.parse(req.body);
    const updatedDevice = await deviceService.updateDevice(
      id,
      updateValidateData
    );
    return res.status(200).json({
      message: "Equipo actualizado correctamente",
      success: true,
      device: updatedDevice,
    });
  } catch (error) {
    next(error);
  }
};

export const stateDevice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const id_usuario = req.user.id_usuario;
    const ip_usuario = req.ip;
    const updateData = req.body;
    await deviceService.stateDevice(id, updateData, id_usuario, ip_usuario);

    return res.status(200).json({
      message: "Equipo dado de baja exitosamente",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
