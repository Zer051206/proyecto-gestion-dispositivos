import * as apiService from "../services/apiService.js";

export const getAssets = async (req, res, next) => {
  try {
    const user = req.user;
    const assets = await apiService.getAssets(user);
    return res.status(200).json({
      message: "Activos obtenidos exitosamente.",
      success: true,
      assets: assets,
    });
  } catch (error) {
    next(error);
  }
};

export const getOperationCenters = async (req, res, next) => {
  try {
    const operationCenters = await apiService.getOperationCenters();
    return res.status(200).json({
      message: "Centros de operacion obtenidos exitosamente.",
      success: true,
      operationCenters: operationCenters,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await apiService.getUsers();
    return res.status(200).json({
      message: "Usuarios obtenidos exitosamente.",
      success: true,
      users: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getLogs = async (req, res, next) => {
  try {
    const user = req.user;
    const logs = await apiService.getLogs(user);
    return res.status(200).json({
      message: "Registros obtenidos exitosamente.",
      success: true,
      logs: logs,
    });
  } catch (error) {
    next(error);
  }
};

export const getDecomissions = async (req, res, next) => {
  try {
    const user = req.user;
    const decomissions = await apiService.getDecomissions(user);
    return res.status(200).json({
      message: "Bajas obtenidas exitosamente.",
      success: true,
      decomissions: decomissions,
    });
  } catch (error) {
    next(error);
  }
};
