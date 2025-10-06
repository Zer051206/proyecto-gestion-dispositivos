import * as catalogueService from "../services/catalogueService.js";

export const getCities = async (req, res, next) => {
  try {
    const cities = await catalogueService.getCities();
    return res.status(200).json(cities);
  } catch (error) {
    next(error);
  }
};

export const getIdTypes = async (req, res, next) => {
  try {
    const idTypes = await catalogueService.getIdTypes();
    return res.status(200).json(idTypes);
  } catch (error) {
    next(error);
  }
};

export const getPeripheralTypes = async (req, res, next) => {
  try {
    const peripheralTypes = await catalogueService.getPeripheralTypes();
    return res.status(200).json(peripheralTypes);
  } catch (error) {
    next(error);
  }
};
