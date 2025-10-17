/**
 * @file apiController.js
 * @module Controllers
 * @description Controlador para los endpoints de la API que devuelven colecciones de datos.
 * Este controlador actúa como intermediario entre las rutas y los servicios,
 * orquestando la obtención de datos para los dashboards principales de la aplicación.
 * @requires ../services/apiService.js
 * @requires ../config/logger.js
 */
import * as apiService from "../services/apiService.js";
import logger from "../config/logger.js";

/**
 * @async
 * @function getAssets
 * @description Obtiene una lista combinada de activos (equipos y periféricos), filtrada según el rol del usuario.
 * @param {import('express').Request} req - El objeto de solicitud de Express, se espera que contenga `req.user`.
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - La función para pasar el control al siguiente middleware.
 */
export const getAssets = async (req, res, next) => {
  try {
    const user = req.user;
    logger.info({ userId: user.id_usuario }, "Solicitando lista de activos");
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

/**
 * @async
 * @function getOperationCenters
 * @description Obtiene una lista de centros de operación, filtrada según el rol del usuario.
 * @param {import('express').Request} req - El objeto de solicitud de Express.
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - La función para pasar el control al siguiente middleware.
 */
export const getOperationCenters = async (req, res, next) => {
  try {
    const user = req.user;
    logger.info(
      { userId: user.id_usuario },
      "Solicitando lista de centros de operación"
    );
    const operationCenters = await apiService.getOperationCenters(user);
    return res.status(200).json({
      message: "Centros de operacion obtenidos exitosamente.",
      success: true,
      operationCenters: operationCenters,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function getUsers
 * @description Obtiene una lista completa de todos los usuarios del sistema.
 * @param {import('express').Request} req - El objeto de solicitud de Express.
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - La función para pasar el control al siguiente middleware.
 */
export const getUsers = async (req, res, next) => {
  try {
    logger.info(
      { userId: req.user.id_usuario },
      "Solicitando lista de todos los usuarios"
    );
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

/**
 * @async
 * @function getLogs
 * @description Obtiene una lista de registros de log, filtrada según el rol del usuario.
 * @param {import('express').Request} req - El objeto de solicitud de Express.
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - La función para pasar el control al siguiente middleware.
 */
export const getLogs = async (req, res, next) => {
  try {
    const user = req.user;
    logger.info({ userId: user.id_usuario }, "Solicitando historial de logs");
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

/**
 * @async
 * @function getDecomissions
 * @description Obtiene una lista de registros de bajas, filtrada según el rol del usuario.
 * @param {import('express').Request} req - El objeto de solicitud de Express.
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - La función para pasar el control al siguiente middleware.
 */
export const getDecomissions = async (req, res, next) => {
  try {
    const user = req.user;
    logger.info({ userId: user.id_usuario }, "Solicitando historial de bajas");
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

/**
 * @async
 * @function getCenterCostByCenterOperation
 * @description Obtiene los centros de costo asociados a un centro de operación específico.
 * @param {import('express').Request} req - El objeto de solicitud de Express, con `req.params.id`.
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - La función para pasar el control al siguiente middleware.
 */
export const getCenterCostByCenterOperation = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(
      { userId: req.user.id_usuario, centerId: id },
      "Solicitando centros de costo para un centro de operación"
    );
    const centerCost = await apiService.getCenterCostByCenterOperation(id);
    return res.status(200).json({
      message: "Centros de costo obtenidos exitosamente.",
      success: true,
      centerCost: centerCost,
    });
  } catch (error) {
    next(error);
  }
};
