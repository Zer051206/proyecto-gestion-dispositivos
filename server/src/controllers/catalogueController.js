import * as catalogueService from "../services/catalogueService.js";

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
