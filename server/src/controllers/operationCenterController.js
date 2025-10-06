import * as operationCenterService from "../services/operationCenterService.js";
import {
  createOperationCenterSchema,
  updateOperationCenterSchema,
} from "../schemas/operationCenterSchema.js";

export const getAllOperationCenters = async (req, res, next) => {
  try {
    const allOperationCenters =
      await operationCenterService.fetchAllOperationCenters();
    return res.status(200).json(allOperationCenters);
  } catch (error) {
    next(error);
  }
};

export const getOperationCenterById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const operationCenter =
      await operationCenterService.fetchOperationCenterById(id);
    return res.status(200).json(operationCenter);
  } catch (error) {
    next(error);
  }
};

export const createOperationCenter = async (req, res, next) => {
  try {
    const createValidateData = createOperationCenterSchema.parse(req.body);
    const newOperationCenter =
      await operationCenterService.createOperationCenter(createValidateData);
    return res.status(201).json(newOperationCenter);
  } catch (error) {
    next(error);
  }
};

export const updateOperationCenter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateValidateData = updateOperationCenterSchema.parse(req.body);
    const updatedOperationCenter =
      await operationCenterService.updateOperationCenter(
        updateValidateData,
        id
      );
    return res.status(200).json(updatedOperationCenter);
  } catch (error) {
    next(error);
  }
};
