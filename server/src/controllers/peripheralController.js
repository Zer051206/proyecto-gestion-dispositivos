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
    const createValidateData = createPeripheralSchema.parse(req.body);
    const newPeripheral = await peripheralService.createPeripheral(
      createValidateData
    );
    return res.status(201).json(newPeripheral);
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
    return res.status(200).json(updatedPeripheral);
  } catch (error) {
    next(error);
  }
};
