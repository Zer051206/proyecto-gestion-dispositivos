/**
 * @file catalogueController.js
 * @module Controllers
 * @description Controlador para los endpoints que sirven los datos de las tablas catálogo.
 * Estas funciones son responsables de obtener listas de datos que se utilizan
 * para poblar opciones en los formularios del frontend, como listas de ciudades,
 * tipos de identificación, etc.
 * @requires ../services/catalogueService.js
 */
import * as catalogueService from "../services/catalogueService.js";

/**
 * @async
 * @function getCities
 * @description Maneja la solicitud para obtener una lista de todas las ciudades.
 * @param {object} req - El objeto de solicitud de Express.
 * @param {object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función para pasar el control al siguiente middleware.
 */
export const getCities = async (req, res, next) => {
  try {
    const cities = await catalogueService.getCities();
    return res.status(200).json({
      message: "Ciudades obtenidas exitosamente.",
      success: true,
      cities: cities,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function getIdTypes
 * @description Maneja la solicitud para obtener una lista de todos los tipos de identificación.
 * @param {object} req - El objeto de solicitud de Express.
 * @param {object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función para pasar el control al siguiente middleware.
 */
export const getIdTypes = async (req, res, next) => {
  try {
    const idTypes = await catalogueService.getIdTypes();
    return res.status(200).json({
      message: "Tipos de identificacion obtenidos exitosamente.",
      success: true,
      identificationTypes: idTypes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @async
 * @function getPeripheralTypes
 * @description Maneja la solicitud para obtener una lista de todos los tipos de periféricos.
 * @param {object} req - El objeto de solicitud de Express.
 * @param {object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función para pasar el control al siguiente middleware.
 */
export const getPeripheralTypes = async (req, res, next) => {
  try {
    const peripheralTypes = await catalogueService.getPeripheralTypes();
    return res.status(200).json({
      message: "Tipos de perifericos obtenidos exitosamente.",
      success: true,
      peripheralTypes: peripheralTypes,
    });
  } catch (error) {
    next(error);
  }
};
