import * as peripheralService from "../services/peripheralService.js";
import {
  createPeripheralSchema,
  updatePeripheralSchema,
} from "../schemas/peripheralSchema.js";

export const getAllPeripherals = async (req, res, next) => {
  try {
    const allPeripherals = await peripheralService.fetchAllPeripherals();
    return res.status(200).json(allPeripherals);
  } catch (error) {
    next(error);
  }
};

export const getPeripheralById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const peripheral = await peripheralService.getPeripheralById(id);
    return res.status(200).json(peripheral);
  } catch (error) {
    next(error);
  }
};

export const createPeripheral = async (req, res, next) => {
  try {
    const ip_usuario = req.ip;
    const id_usuario = req.user.id_usuario;
    const createValidateData = createPeripheralSchema.parse(req.body);
    const newPeripheral = await peripheralService.createPeripheral(
      createValidateData,
      ip_usuario,
      id_usuario
    );
    return res.status(201).json({
      message: "Periferico creado exitosamente.",
      success: true,
      peripheral: newPeripheral,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePeripheral = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateValidateData = updatePeripheralSchema.parse(req.body);
    const updatedPeripheral = await peripheralService.updatePeripheral(
      updateValidateData,
      id
    );
    return res.status(200).json({
      message: "Periferico actualizado exitosamente",
      success: true,
      peripheral: updatedPeripheral,
    });
  } catch (error) {
    next(error);
  }
};

export const decomissionPeripheral = async (req, res, next) => {
  try {
    const { id } = req.params;
    const id_usuario = req.user.id_usuario;
    const ip_usuario = req.ip;
    const peripheral = await peripheralService.decomissionPeripheral(
      id,
      id_usuario,
      ip_usuario
    );
    return res.status(200).json({
      message: "Periferico dado de baja exitosamente",
      success: true,
      peripheral: peripheral,
    });
  } catch (error) {
    next(error);
  }
};
