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
    const ip_usuario = req.ip;
    const id_usuario = req.user.id_usuario;
    const createValidateData = createOperationCenterSchema.parse(req.body);
    const newOperationCenter =
      await operationCenterService.createOperationCenter(
        createValidateData,
        ip_usuario,
        id_usuario
      );
    return res.status(201).json({
      message: "centro de operacion creado con exito.",
      success: true,
      operationCenter: newOperationCenter,
    });
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
    return res.status(200).json({
      message: "Centro de operacion actualizado con exito.",
      success: true,
      operationCenter: updatedOperationCenter,
    });
  } catch (error) {
    next(error);
  }
};

export const closeOperationCenter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const id_usuario = req.user.id_usuario;
    const ip_usuario = req.ip;
    const closedOperationCenter =
      await operationCenterService.closeOperationCenter(
        id,
        id_usuario,
        ip_usuario
      );

    return res.status(200).json({
      message: "Centro de operacion cerrado exitosamente.",
      success: true,
      operationCenter: closedOperationCenter,
    });
  } catch (error) {
    next(error);
  }
};
